import { Router } from "express";

const router = new Router();

router.get('/', (req, res) => {
  const isAuthenticated = req.decoded?.user_id;

  return res.status(200).json(
    {
      "horizontal": [
        ...(req.decoded?.user_id ? [{
          "id": "keybinds",
          "title": "Keybinds",
          "type": "group",
          "children": [
            {
              "id": "keybinds.view-all",
              "title": "View All",
              "type": "basic",
              "link": "/keybinds/view-all"
            },
            {
              "id": "keybinds.my-keybindings",
              "title": "My Keybindings",
              "type": "basic",
              "link": "/keybinds/my-keybindings"
            }
          ]
        }] : [{
          "id": "keybinds",
          "title": "Keybinds",
          "type": "basic",
          "link": "/keybinds/view-all"
        }]),
        {
          "id": "macros",
          "title": "Macros",
          "type": "basic",
          "link": "/macros"
        },
        {
          "id": "abilities",
          "title": "Abilities",
          "type": "basic",
          "link": "/abilities"
        }
      ],
      "default": [
        ...(req.decoded?.user_id ? [{
          "id": "keybinds",
          "title": "Keybinds",
          "subtitle": "",
          "type": "group",
          "children": [
            {
              "id": "keybinds.view-all",
              "title": "View All",
              "type": "basic",
              "link": "/keybinds/view-all"
            },
            {
              "id": "keybinds.my-keybindings",
              "title": "My Keybindings",
              "type": "basic",
              "link": "/keybinds/my-keybindings"
            }
          ]
        }] : [{
          "id": "keybinds",
          "title": "Keybinds",
          "type": "basic",
          "link": "/keybinds/view-all"
        }]),
        {
          "id": "macros",
          "title": "Macros",
          "type": "basic",
          "link": "/macros"
        },
        {
          "id": "abilities",
          "title": "Abilities",
          "type": "basic",
          "link": "/abilities"
        }
      ]
    }
  )
})

export default router;
