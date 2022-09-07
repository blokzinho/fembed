const express = require("express")
const server = express()
const fetch = require("node-fetch")

const port = process.env.PORT || 3000;

const getJSON = async (id) => {
    const redirect = await fetch(`https://fembed.net/v/${id}`).then(res => res.url.replace("/v/", "/api/source/"))
    const video = await fetch(redirect, { method: "POST" }).then(res => res.json())
    if (!video["success"]) return { success: false }
    return video
}


const getVideoURL = async (videoJSON) => {
    const data = []
    for (filedata of videoJSON) {
        data.push({
            file: filedata["file"],
            label: filedata["label"],
            type: filedata["type"]
        })
    }
    return data
}

server.get("/:id", async (req, res) => {
    const id = req.params.id
    const videoJSON = await getJSON(id)
    if (!videoJSON["success"]) return res.status(404).json({ success: false })
    return res.json(videoJSON["data"])
})

server.listen(port, () => {
    console.log(
        "Express server listening on port %d in %s mode",
        port,
        server.settings.env
    )
})

