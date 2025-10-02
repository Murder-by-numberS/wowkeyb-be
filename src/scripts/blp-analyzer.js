import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * BLP File Analyzer
 * Extracts metadata and information from Blizzard BLP image files
 */
class BLPAnalyzer {
    constructor() {
        this.blpSignatures = {
            0x31504C42: 'BLP1', // 'BLP1' in little-endian
            0x32504C42: 'BLP2'  // 'BLP2' in little-endian
        };

        this.compressionTypes = {
            0: 'JPEG',
            1: 'Palette',
            2: 'DXT1',
            3: 'DXT3',
            4: 'DXT5',
            5: 'ARGB8888',
            6: 'ARGB1555',
            7: 'ARGB4444',
            8: 'RGB565',
            9: 'DXT1A'
        };
    }

    /**
     * Read a 32-bit unsigned integer from buffer at offset
     */
    readUInt32(buffer, offset) {
        return buffer.readUInt32LE(offset);
    }

    /**
     * Read a 16-bit unsigned integer from buffer at offset
     */
    readUInt16(buffer, offset) {
        return buffer.readUInt16LE(offset);
    }

    /**
     * Read a 8-bit unsigned integer from buffer at offset
     */
    readUInt8(buffer, offset) {
        return buffer.readUInt8(offset);
    }

    /**
     * Read a string from buffer at offset with specified length
     */
    readString(buffer, offset, length) {
        return buffer.toString('ascii', offset, offset + length).replace(/\0/g, '');
    }

    /**
     * Search for URL patterns in the buffer
     * @param {Buffer} buffer - The file buffer
     * @returns {Array<string>} - Array of found URLs
     */
    findURLs(buffer) {
        const urls = [];
        const text = buffer.toString('ascii');

        // Common URL patterns
        const urlPatterns = [
            /https?:\/\/[^\s\x00-\x1f\x7f-\x9f]+/gi,
            /wow\.zamimg\.com[^\s\x00-\x1f\x7f-\x9f]*/gi,
            /wowhead\.com[^\s\x00-\x1f\x7f-\x9f]*/gi,
            /battle\.net[^\s\x00-\x1f\x7f-\x9f]*/gi,
            /blizzard\.com[^\s\x00-\x1f\x7f-\x9f]*/gi,
            /[a-zA-Z0-9_-]+\.(jpg|jpeg|png|gif|bmp|tga|dds|blp)/gi
        ];

        urlPatterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) {
                matches.forEach(match => {
                    if (!urls.includes(match)) {
                        urls.push(match);
                    }
                });
            }
        });

        return urls;
    }

    /**
     * Search for text strings in the buffer
     * @param {Buffer} buffer - The file buffer
     * @returns {Array<string>} - Array of found text strings
     */
    findTextStrings(buffer) {
        const strings = [];
        const text = buffer.toString('ascii');

        // Look for readable strings (3+ characters, printable ASCII)
        const stringPattern = /[!-~\s]{3,}/g;
        const matches = text.match(stringPattern);

        if (matches) {
            matches.forEach(match => {
                const cleanMatch = match.trim();
                if (cleanMatch.length >= 3 &&
                    !cleanMatch.match(/^[\x00-\x1f\x7f-\x9f]+$/) && // Not just control characters
                    !cleanMatch.match(/^\d+$/) && // Not just numbers
                    !strings.includes(cleanMatch)) {
                    strings.push(cleanMatch);
                }
            });
        }

        return strings.slice(0, 20); // Limit to first 20 strings
    }

    /**
     * Analyze a BLP file and extract metadata
     * @param {string} filePath - Path to the BLP file
     * @returns {Object} - Extracted metadata
     */
    analyzeBLPFile(filePath) {
        try {
            const buffer = fs.readFileSync(filePath);
            const fileSize = buffer.length;

            if (fileSize < 16) {
                throw new Error('File too small to be a valid BLP file');
            }

            // Read BLP signature
            const signature = this.readUInt32(buffer, 0);
            const blpType = this.blpSignatures[signature];

            if (!blpType) {
                throw new Error('Invalid BLP file signature');
            }

            const result = {
                filePath: filePath,
                fileName: path.basename(filePath),
                fileSize: fileSize,
                blpType: blpType,
                isValid: true,
                error: null,
                urls: this.findURLs(buffer),
                textStrings: this.findTextStrings(buffer)
            };

            if (blpType === 'BLP1') {
                return this.analyzeBLP1(buffer, result);
            } else if (blpType === 'BLP2') {
                return this.analyzeBLP2(buffer, result);
            }

        } catch (error) {
            return {
                filePath: filePath,
                fileName: path.basename(filePath),
                fileSize: fs.existsSync(filePath) ? fs.statSync(filePath).size : 0,
                isValid: false,
                error: error.message
            };
        }
    }

    /**
     * Analyze BLP1 format
     */
    analyzeBLP1(buffer, result) {
        try {
            // BLP1 Header structure
            result.version = 'BLP1';
            result.compression = this.readUInt32(buffer, 4);
            result.compressionType = this.compressionTypes[result.compression] || 'Unknown';
            result.alphaBits = this.readUInt32(buffer, 8);
            result.width = this.readUInt32(buffer, 12);
            result.height = this.readUInt32(buffer, 16);
            result.mipmapCount = this.readUInt32(buffer, 20);
            result.mipmapOffsets = [];
            result.mipmapSizes = [];

            // Read mipmap offsets (16 entries)
            for (let i = 0; i < 16; i++) {
                const offset = this.readUInt32(buffer, 24 + (i * 4));
                result.mipmapOffsets.push(offset);
            }

            // Read mipmap sizes (16 entries)
            for (let i = 0; i < 16; i++) {
                const size = this.readUInt32(buffer, 88 + (i * 4));
                result.mipmapSizes.push(size);
            }

            // Calculate actual mipmap count
            result.actualMipmapCount = result.mipmapOffsets.filter(offset => offset !== 0).length;

            // Get palette if present
            if (result.compression === 1) { // Palette compression
                result.hasPalette = true;
                result.paletteSize = 256 * 4; // 256 colors * 4 bytes (BGRA)
            } else {
                result.hasPalette = false;
            }

            return result;

        } catch (error) {
            result.isValid = false;
            result.error = `BLP1 parsing error: ${error.message}`;
            return result;
        }
    }

    /**
     * Analyze BLP2 format
     */
    analyzeBLP2(buffer, result) {
        try {
            // BLP2 Header structure
            result.version = 'BLP2';
            result.compression = this.readUInt32(buffer, 4);
            result.compressionType = this.compressionTypes[result.compression] || 'Unknown';
            result.alphaBits = this.readUInt32(buffer, 8);
            result.width = this.readUInt32(buffer, 12);
            result.height = this.readUInt32(buffer, 16);
            result.mipmapCount = this.readUInt32(buffer, 20);
            result.mipmapOffsets = [];
            result.mipmapSizes = [];

            // Read mipmap offsets (16 entries)
            for (let i = 0; i < 16; i++) {
                const offset = this.readUInt32(buffer, 24 + (i * 4));
                result.mipmapOffsets.push(offset);
            }

            // Read mipmap sizes (16 entries)
            for (let i = 0; i < 16; i++) {
                const size = this.readUInt32(buffer, 88 + (i * 4));
                result.mipmapSizes.push(size);
            }

            // Calculate actual mipmap count
            result.actualMipmapCount = result.mipmapOffsets.filter(offset => offset !== 0).length;

            // BLP2 specific fields
            result.alphaType = this.readUInt32(buffer, 152);
            result.alphaDepth = this.readUInt32(buffer, 156);
            result.hasAlpha = result.alphaBits > 0 || result.alphaType > 0;

            // Get palette if present
            if (result.compression === 1) { // Palette compression
                result.hasPalette = true;
                result.paletteSize = 256 * 4; // 256 colors * 4 bytes (BGRA)
            } else {
                result.hasPalette = false;
            }

            return result;

        } catch (error) {
            result.isValid = false;
            result.error = `BLP2 parsing error: ${error.message}`;
            return result;
        }
    }

    /**
     * Analyze multiple BLP files
     * @param {Array<string>} filePaths - Array of file paths
     * @returns {Array<Object>} - Array of analysis results
     */
    analyzeMultipleBLPFiles(filePaths) {
        const results = [];

        for (const filePath of filePaths) {
            console.log(`🔍 Analyzing: ${path.basename(filePath)}`);
            const result = this.analyzeBLPFile(filePath);
            results.push(result);
        }

        return results;
    }

    /**
     * Generate a summary report
     * @param {Array<Object>} results - Analysis results
     * @returns {Object} - Summary statistics
     */
    generateSummary(results) {
        const summary = {
            totalFiles: results.length,
            validFiles: results.filter(r => r.isValid).length,
            invalidFiles: results.filter(r => !r.isValid).length,
            blp1Files: results.filter(r => r.blpType === 'BLP1').length,
            blp2Files: results.filter(r => r.blpType === 'BLP2').length,
            compressionTypes: {},
            dimensions: [],
            totalSize: 0,
            errors: []
        };

        results.forEach(result => {
            if (result.isValid) {
                summary.totalSize += result.fileSize;

                // Count compression types
                if (result.compressionType) {
                    summary.compressionTypes[result.compressionType] =
                        (summary.compressionTypes[result.compressionType] || 0) + 1;
                }

                // Collect dimensions
                if (result.width && result.height) {
                    summary.dimensions.push({
                        width: result.width,
                        height: result.height,
                        file: result.fileName
                    });
                }
            } else {
                summary.errors.push({
                    file: result.fileName,
                    error: result.error
                });
            }
        });

        return summary;
    }

    /**
     * Print analysis results in a formatted way
     * @param {Array<Object>} results - Analysis results
     */
    printResults(results) {
        console.log('\n' + '='.repeat(80));
        console.log('📊 BLP FILE ANALYSIS RESULTS');
        console.log('='.repeat(80));

        results.forEach((result, index) => {
            console.log(`\n📁 File ${index + 1}: ${result.fileName}`);
            console.log('─'.repeat(50));

            if (result.isValid) {
                console.log(`✅ Status: Valid ${result.blpType} file`);
                console.log(`📏 Dimensions: ${result.width}x${result.height}`);
                console.log(`🗜️  Compression: ${result.compressionType} (${result.compression})`);
                console.log(`🎨 Alpha: ${result.alphaBits} bits`);
                console.log(`📐 Mipmaps: ${result.actualMipmapCount}/${result.mipmapCount}`);
                console.log(`📦 File Size: ${(result.fileSize / 1024).toFixed(2)} KB`);

                if (result.hasPalette) {
                    console.log(`🎨 Palette: Yes (${result.paletteSize} bytes)`);
                }

                if (result.hasAlpha !== undefined) {
                    console.log(`🔍 Has Alpha: ${result.hasAlpha ? 'Yes' : 'No'}`);
                }

                if (result.urls && result.urls.length > 0) {
                    console.log(`🌐 URLs Found: ${result.urls.length}`);
                    result.urls.forEach((url, index) => {
                        console.log(`   ${index + 1}. ${url}`);
                    });
                } else {
                    console.log(`🌐 URLs Found: None`);
                }

                if (result.textStrings && result.textStrings.length > 0) {
                    console.log(`📝 Text Strings: ${result.textStrings.length} found`);
                    result.textStrings.slice(0, 5).forEach((str, index) => {
                        console.log(`   ${index + 1}. "${str}"`);
                    });
                    if (result.textStrings.length > 5) {
                        console.log(`   ... and ${result.textStrings.length - 5} more`);
                    }
                }
            } else {
                console.log(`❌ Status: Invalid - ${result.error}`);
                console.log(`📦 File Size: ${(result.fileSize / 1024).toFixed(2)} KB`);
            }
        });

        // Print summary
        const summary = this.generateSummary(results);
        console.log('\n' + '='.repeat(80));
        console.log('📈 SUMMARY');
        console.log('='.repeat(80));
        console.log(`📁 Total Files: ${summary.totalFiles}`);
        console.log(`✅ Valid Files: ${summary.validFiles}`);
        console.log(`❌ Invalid Files: ${summary.invalidFiles}`);
        console.log(`📦 Total Size: ${(summary.totalSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`🔢 BLP1 Files: ${summary.blp1Files}`);
        console.log(`🔢 BLP2 Files: ${summary.blp2Files}`);

        if (Object.keys(summary.compressionTypes).length > 0) {
            console.log('\n🗜️  Compression Types:');
            Object.entries(summary.compressionTypes).forEach(([type, count]) => {
                console.log(`   ${type}: ${count} files`);
            });
        }

        if (summary.errors.length > 0) {
            console.log('\n❌ Errors:');
            summary.errors.forEach(error => {
                console.log(`   ${error.file}: ${error.error}`);
            });
        }
    }
}

// Run the analyzer if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const analyzer = new BLPAnalyzer();
    const filePaths = process.argv.slice(2);

    if (filePaths.length === 0) {
        console.log('Usage: node blp-analyzer.js <file1.blp> [file2.blp] ...');
        console.log('Example: node blp-analyzer.js /path/to/ability_orangebirdclassic.blp');
        process.exit(1);
    }

    console.log('🔍 BLP File Analyzer');
    console.log('===================');
    console.log(`Analyzing ${filePaths.length} file(s)...\n`);

    const results = analyzer.analyzeMultipleBLPFiles(filePaths);
    analyzer.printResults(results);
}

export default BLPAnalyzer;
