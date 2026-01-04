# StreamLocal

StreamLocal is a lightweight, browser-based application for playing local video files from a selected folder in a continuous loop. It is designed for simplicity and ease of use, allowing users to view and cycle through their local video collections without installing a full media player.

---

## Overview

StreamLocal runs entirely in the browser and provides a minimal interface for selecting a local folder and playing all supported video files it contains. Once loaded, videos are played sequentially and loop automatically.

This project is suitable for use cases such as:
- Continuous playback displays
- Local media viewing
- Background or kiosk-style video loops
- Simple local streaming setups

---

## Features

- Local folder video playback through the browser
- Automatic looping of all videos in the selected directory
- Simple, clean web-based user interface
- No external services or accounts required

---

## Requirements

- A modern web browser (Chrome, Firefox, Edge, or similar)
- Local files containing supported video formats
- A local web server is recommended for best compatibility with browser file access restrictions

---

## Installation

1. Clone the repository from GitHub  
   git clone https://github.com/Jimmyu2foru18/StreamLocal

2. Open the project directory

3. Serve the files using a local web server, or open the main HTML file directly in your browser if your browser configuration allows it

---

## Usage

1. Launch the application in your browser
2. Use the interface to select a local folder containing video files
3. Playback will begin automatically and continue looping through all detected videos

---

## Project Structure

- index.html  
  Main entry point for the application

- nplayer.html  
  Additional player view

- siplayer.html  
  Additional player view

- script.js  
  JavaScript logic for loading files, managing playback, and looping behavior

- styles.css  
  Styling for the user interface

- package.json  
  Project metadata and dependency information

- node_modules  
  Installed dependencies, if applicable

---

## Notes

- Browser security restrictions may limit direct access to local files when opening HTML files directly. Running a local server is strongly recommended.
- Supported video formats depend on the browser being used.
