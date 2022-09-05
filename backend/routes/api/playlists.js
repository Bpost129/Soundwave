const express = require('express')

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Album, Song, User, Comment, Playlist } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();



// Get details of a playlist based on id --------------------------
router.get('/:playlistId', async (req, res, next) => {
    const { id } = req.params
    const playlist = await Playlist.findOne({
        where: {
            id
        }
    })

    if (!playlist) {
        res.status = 404;
        res.json({
            "message": "Playlist couldn't be found",
            "statusCode": 404
        })
    }

    res.json(playlist);
})

// Create a playlist --------------------------
router.post('/', requireAuth, async (req, res, next) => {
    // Requires Authentication
    const { id } = req.user;
    const { name, description, imageUrl } = req.body;

    if (!name) {
        res.status = 400;
        res.json({
            "message": "Validation error",
            "statusCode": 400,
            "errors": {
                "name": "Playlist name is required"
            }
        })
    }

    const playlist = await Playlist.create({
        userId: id,
        name,
        description,
        imageUrl,
    })

    // album[0].toJSON()

    res.json(playlist);
})

// Add a song based on playlist id ------------------------------
router.post('/:playlistId/songs', requireAuth, async (req, res, next) => {
    // Requires Authentication
    const { id } = req.params;
    const { songId } = req.body;

    let playlist = await Playlist.findOne({
        where: {
            id
        }
    })

    let song = await Song.findOne({
        where: {
            id: songId
        }
    })

    if (!playlist) {
        res.status = 404;
        res.json({
            "message": "Playlist couldn't be found",
            "statusCode": 404
        })
    }

    if (!song) {
        res.status = 404;
        res.json({
            "message": "Song couldn't be found",
            "statusCode": 404
        })
    }

    await playlist.addSong({
        where: {
            id: songId
        }
    })

    res.json(playlist);
})

// Edit a playlist -----------------------------
router.put('/:playlistId', requireAuth, async (req, res, next) => {
    // Requires Authentication
    const { id } = req.params
    const { name, imageUrl } = req.body
    const playlist = await Playlist.findOne({
        where: {
            id
        }
    })

    if (!name) {
        res.status = 400;
        res.json({
            "message": "Validation error",
            "statusCode": 400,
            "errors": {
                "name": "Playlist name is required"
            }
        })
    }

    if (!playlist) {
        res.status = 404;
        res.json({
            "message": "Playlist couldn't be found",
            "statusCode": 404
        })
    }

    playlist.name = name;
    playlist.imageUrl = imageUrl;

    res.json(playlist);
})

// Delete a playlist ------------------------------
router.delete('/:playlistId', requireAuth, async (req, res, next) => {
    // Requires Authentication
    const { id } = req.params;
    const playlist = await Playlist.findOne({
        where: {
            id
        }
    })

    if (!playlist) {
        res.status = 404;
        res.json({
          "message": "Playlist couldn't be found",
          "statusCode": 404
        })
    }

    playlist.destroy();
    res.json({
        "message": "Succefully deleted",
        "statusCode": 200
    })
})

// Get all playlists from the current user -------------------------
router.get('/current', requireAuth, async (req, res, next) => {
    // Requires Authentication
    const { id } = req.user;

    const playlists = await Playlist.findAll({
        where: {
            userId: id,
        }
    })

    const playlistArr = [];
    for (let playlist of playlists) {
        playlistArr.push(playlist.toJSON())
    }

    res.json(playlistArr);
})



module.exports = router;