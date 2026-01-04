// Netflix-style Video Player Application
class VideoPlayer {
    constructor() {
        this.videoFiles = [];
        this.currentVideoIndex = 0;
        this.currentFolder = null;
        this.isLooping = true;
        this.currentSlidePosition = 0;
        
        // DOM elements
        this.videoPlayer = document.getElementById('videoPlayer');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.playPauseIcon = document.getElementById('playPauseIcon');
        this.videoProgress = document.getElementById('videoProgress');
        this.videoProgressHandle = document.getElementById('videoProgressHandle');
        this.currentTime = document.getElementById('currentTime');
        this.totalTime = document.getElementById('totalTime');
        this.selectFolderBtn = document.getElementById('selectFolderBtn');
        this.heroSelectBtn = document.getElementById('heroSelectBtn');
        this.emptySelectBtn = document.getElementById('emptySelectBtn');
        this.currentFolderElement = document.getElementById('currentFolder');
        this.videoGrid = document.getElementById('videoGrid');
        this.continueGrid = document.getElementById('continueGrid');
        this.statusText = document.getElementById('statusText');
        this.statusBar = document.getElementById('statusBar');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        
        // Debug DOM element initialization
        console.log('=== DOM ELEMENT INITIALIZATION ===');
        console.log('statusText element:', this.statusText);
        console.log('currentFolderElement:', this.currentFolderElement);
        console.log('videoPlayer:', this.videoPlayer);
        console.log('videoGrid:', this.videoGrid);
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.loopToggle = document.getElementById('loopToggle');
        this.prevSlide = document.getElementById('prevSlide');
        this.nextSlide = document.getElementById('nextSlide');
        this.prevContinue = document.getElementById('prevContinue');
        this.nextContinue = document.getElementById('nextContinue');
        this.heroSection = document.getElementById('heroSection');
        this.nowPlayingSection = document.getElementById('nowPlayingSection');
        this.librarySection = document.getElementById('librarySection');
        this.navbar = document.querySelector('.navbar'); // Add navbar reference
        this.emptyState = document.getElementById('emptyState');
        this.currentVideoTitle = document.getElementById('currentVideoTitle');
        this.currentVideoInfo = document.getElementById('currentVideoMeta');
        this.videoCount = document.getElementById('videoCount');
        this.continueCount = document.getElementById('continueCount');
        this.videoList = document.getElementById('videoList');
        this.videoListContainer = document.getElementById('videoListContainer');
        
        // Add navbar reference for scroll effect
        this.navbar = document.querySelector('.navbar');
        
        // Navigation elements
        this.navTabs = document.querySelectorAll('.nav-tab');
        
        // Video file extensions
        this.videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.flv', '.wmv'];
        
        this.initEventListeners();
        this.showInitialState();
        this.setupNavbarScroll();
        this.setupNavigation();
    }
    
    toggleView(viewType) {
        const gridViewBtn = document.getElementById('gridViewBtn');
        const listViewBtn = document.getElementById('listViewBtn');
        const videoGrid = document.getElementById('videoGrid');
        const videoList = document.getElementById('videoList');
        
        if (!videoGrid || !videoList) return;
        
        if (viewType === 'grid') {
            // Show grid view
            videoGrid.style.display = 'grid';
            videoList.style.display = 'none';
            if (gridViewBtn) gridViewBtn.classList.add('active');
            if (listViewBtn) listViewBtn.classList.remove('active');
        } else {
            // Show list view
            videoGrid.style.display = 'none';
            videoList.style.display = 'block';
            if (gridViewBtn) gridViewBtn.classList.remove('active');
            if (listViewBtn) listViewBtn.classList.add('active');
            
            // Populate list view if it's empty
            if (videoList.children.length === 0) {
                this.displayVideoList();
            }
        }
    }
    
    displayVideoList() {
        const videoList = document.getElementById('videoList');
        if (!videoList) return;
        
        videoList.innerHTML = '';
        
        this.videoFiles.forEach((video, index) => {
            const listItem = document.createElement('div');
            listItem.className = 'video-list-item';
            listItem.innerHTML = `
                <div class="video-list-thumbnail">
                    <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
                <div class="video-list-info">
                    <h3 class="video-list-title">${video.name}</h3>
                    <p class="video-list-meta">Video ${index + 1} of ${this.videoFiles.length}</p>
                </div>
            `;
            
            listItem.addEventListener('click', () => this.playVideo(index));
            videoList.appendChild(listItem);
        });
    }
    
    setupNavbarScroll() {
        window.addEventListener('scroll', () => {
            if (this.navbar) {
                if (window.scrollY > 50) {
                    this.navbar.classList.add('scrolled');
                } else {
                    this.navbar.classList.remove('scrolled');
                }
            }
        });
    }
    
    setupNavigation() {
        if (this.navTabs) {
            this.navTabs.forEach(tab => {
                tab.addEventListener('click', (e) => {
                    const section = e.target.dataset.section;
                    this.switchSection(section);
                });
            });
        }
    }
    
    switchSection(section) {
        // Update active tab with null checks
        if (this.navTabs) {
            this.navTabs.forEach(tab => {
                if (tab) {
                    tab.classList.remove('active');
                    if (tab.dataset.section === section) {
                        tab.classList.add('active');
                    }
                }
            });
        }
        
        // Hide all sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(sec => {
            if (sec) sec.style.display = 'none';
        });
        
        // Show selected section with null checks
        switch(section) {
            case 'home':
                const heroSection = document.getElementById('heroSection');
                if (heroSection) heroSection.style.display = 'block';
                // Only show video player if we have videos loaded
                if (this.videoFiles && this.videoFiles.length > 0) {
                    const videoPlayerSection = document.getElementById('videoPlayerSection');
                    if (videoPlayerSection) videoPlayerSection.style.display = 'block';
                }
                break;
            case 'library':
                const librarySection = document.getElementById('librarySection');
                if (librarySection) librarySection.style.display = 'block';
                break;
            case 'player':
                const videoPlayerSection = document.getElementById('videoPlayerSection');
                if (videoPlayerSection) videoPlayerSection.style.display = 'block';
                break;
            case 'settings':
                const settingsSection = document.getElementById('settingsSection');
                if (settingsSection) settingsSection.style.display = 'block';
                break;
        }
    }
    
    initEventListeners() {
        // Add null checks for all elements
        if (this.selectFolderBtn) this.selectFolderBtn.addEventListener('click', () => this.selectFolder());
        
        const startWatchingBtn = document.getElementById('startWatchingBtn');
        if (startWatchingBtn) startWatchingBtn.addEventListener('click', () => this.selectFolder());
        
        const browseLibraryBtn = document.getElementById('browseLibraryBtn');
        if (browseLibraryBtn) browseLibraryBtn.addEventListener('click', () => this.selectFolder());
        
        if (this.emptySelectBtn) this.emptySelectBtn.addEventListener('click', () => this.selectFolder());
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.playPrevious());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.playNext());
        if (this.playPauseBtn) this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        
        // View toggle buttons
        const gridViewBtn = document.getElementById('gridViewBtn');
        const listViewBtn = document.getElementById('listViewBtn');
        if (gridViewBtn) gridViewBtn.addEventListener('click', () => this.toggleView('grid'));
        if (listViewBtn) listViewBtn.addEventListener('click', () => this.toggleView('list'));
        
        const prevSlide = document.getElementById('prevSlide');
        const nextSlide = document.getElementById('nextSlide');
        const prevContinue = document.getElementById('prevContinue');
        const nextContinue = document.getElementById('nextContinue');
        
        if (prevSlide) prevSlide.addEventListener('click', () => this.slidePrev());
        if (nextSlide) nextSlide.addEventListener('click', () => this.slideNext());
        if (prevContinue) prevContinue.addEventListener('click', () => this.slideContinuePrev());
        if (nextContinue) nextContinue.addEventListener('click', () => this.slideContinueNext());
        
        if (this.loopToggle) {
            this.loopToggle.addEventListener('change', (e) => {
                this.isLooping = e.target.checked;
                this.updateStatus(this.isLooping ? 'Auto-play enabled' : 'Auto-play disabled');
            });
        }
        
        if (this.fullscreenBtn) {
            this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }
        
        // Video player events
        this.videoPlayer.addEventListener('loadstart', () => console.log('Video loadstart event'));
        this.videoPlayer.addEventListener('progress', () => console.log('Video progress event'));
        this.videoPlayer.addEventListener('loadedmetadata', () => {
            console.log('Video loadedmetadata event');
            this.updateProgress();
        });
        this.videoPlayer.addEventListener('loadeddata', () => console.log('Video loadeddata event'));
        this.videoPlayer.addEventListener('canplay', () => console.log('Video canplay event'));
        this.videoPlayer.addEventListener('playing', () => console.log('Video playing event'));
        this.videoPlayer.addEventListener('ended', () => this.handleVideoEnded());
        this.videoPlayer.addEventListener('error', (e) => this.handleVideoError(e));
        this.videoPlayer.addEventListener('timeupdate', () => this.updateProgress());
        this.videoPlayer.addEventListener('play', () => this.updatePlayPauseButton(true));
        this.videoPlayer.addEventListener('pause', () => this.updatePlayPauseButton(false));
        
        // Progress bar events
        this.videoProgressBar = this.videoProgress.parentElement;
        this.videoProgressBar.addEventListener('click', (e) => this.seekToPosition(e));
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.videoFiles.length === 0) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    this.playPrevious();
                    break;
                case 'ArrowRight':
                    this.playNext();
                    break;
                case ' ':
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
                case 'f':
                case 'F':
                    this.toggleFullscreen();
                    break;
            }
        });
    }
    
    showInitialState() {
        // Show home section by default
        this.switchSection('home');
        
        if (this.heroSection) this.heroSection.style.display = 'flex';
        if (this.nowPlayingSection) this.nowPlayingSection.style.display = 'none';
        if (this.librarySection) this.librarySection.style.display = 'none';
        if (this.emptyState) this.emptyState.style.display = 'none';
    }
    
    showLibraryState() {
        console.log('showLibraryState called');
        console.log('heroSection:', this.heroSection);
        console.log('nowPlayingSection:', this.nowPlayingSection);
        console.log('librarySection:', this.librarySection);
        console.log('emptyState:', this.emptyState);
        
        // Switch to home section which includes both hero and player
        this.switchSection('home');
        
        if (this.heroSection) this.heroSection.style.display = 'none';
        if (this.nowPlayingSection) this.nowPlayingSection.style.display = 'block';
        if (this.librarySection) this.librarySection.style.display = 'block';
        if (this.emptyState) this.emptyState.style.display = 'none';
    }
    
    showEmptyState() {
        if (this.heroSection) this.heroSection.style.display = 'none';
        if (this.nowPlayingSection) this.nowPlayingSection.style.display = 'none';
        if (this.librarySection) this.librarySection.style.display = 'none';
        if (this.emptyState) this.emptyState.style.display = 'flex';
    }
    
    async selectFolder() {
        try {
            // Check if File System Access API is supported
            if (!window.showDirectoryPicker) {
                this.updateStatus('File System Access API not supported. Please use Chrome, Edge, or Opera.');
                return;
            }
            
            // Show folder selection modal first
            this.showFolderModal();
            
        } catch (error) {
            if (error.name === 'AbortError') {
                this.updateStatus('Folder selection cancelled');
            } else {
                console.error('Error selecting folder:', error);
                this.updateStatus('Error selecting folder: ' + error.message);
            }
        }
    }
    
    async showFolderModal() {
        try {
            // Request directory access
            const dirHandle = await window.showDirectoryPicker();
            this.currentFolder = dirHandle;
            
            // Scan for video files
            await this.scanFolderForVideos(dirHandle);
            
            if (this.videoFiles.length === 0) {
                this.updateStatus('No video files found in selected folder');
                return;
            }
            
            // Show the video player interface
            this.showLibraryState();
            this.displayVideoLibrary();
            
            // Start playing the first video
            this.playVideo(0);
            
        } catch (error) {
            if (error.name === 'AbortError') {
                this.updateStatus('Folder selection cancelled');
            } else {
                console.error('Error in showFolderModal:', error);
                this.updateStatus('Error accessing folder: ' + error.message);
            }
        }
    }
    
    async scanFolderForVideos(dirHandle) {
        this.videoFiles = [];
        
        try {
            for await (const entry of dirHandle.values()) {
                if (entry.kind === 'file') {
                    const file = await entry.getFile();
                    const fileName = file.name.toLowerCase();
                    
                    // Check if file is a video file
                    const isVideoFile = this.videoExtensions.some(ext => 
                        fileName.endsWith(ext.toLowerCase())
                    );
                    
                    if (isVideoFile) {
                        this.videoFiles.push({
                            name: file.name,
                            file: file,
                            handle: entry
                        });
                    }
                }
            }
            
            // Sort video files alphabetically
            this.videoFiles.sort((a, b) => a.name.localeCompare(b.name));
            
            this.updateStatus(`Found ${this.videoFiles.length} video files`);
            
        } catch (error) {
            console.error('Error scanning folder:', error);
            this.updateStatus('Error scanning folder: ' + error.message);
        }
    }
    
    displayVideoLibrary() {
        if (!this.videoGrid) return;
        
        this.videoGrid.innerHTML = '';
        
        this.videoFiles.forEach((video, index) => {
            const videoCard = document.createElement('div');
            videoCard.className = 'video-card';
            videoCard.innerHTML = `
                <div class="video-thumbnail">
                    <div class="video-placeholder">
                        <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
                        </svg>
                    </div>
                </div>
                <div class="video-info">
                    <h4 class="video-title">${video.name}</h4>
                    <p class="video-duration">Video File</p>
                </div>
            `;
            
            videoCard.addEventListener('click', () => this.playVideo(index));
            this.videoGrid.appendChild(videoCard);
        });
    }
    
    async playVideo(index) {
        if (index < 0 || index >= this.videoFiles.length) {
            console.error('Invalid video index:', index);
            return;
        }
        
        this.currentVideoIndex = index;
        const video = this.videoFiles[index];
        
        try {
            // Make sure video player section is visible
            if (this.videoPlayerSection) {
                this.videoPlayerSection.style.display = 'block';
            }
            
            // Make sure now playing section is visible
            if (this.nowPlayingSection) {
                this.nowPlayingSection.style.display = 'block';
            }
            
            // Create object URL for the video file
            const videoUrl = URL.createObjectURL(video.file);
            
            // Set the video source
            this.videoPlayer.src = videoUrl;
            
            // Update video info
            this.currentVideoTitle.textContent = video.name;
            this.currentVideoInfo.textContent = `Video ${index + 1} of ${this.videoFiles.length}`;
            
            // Play the video
            await this.videoPlayer.play();
            
            // Update UI
            this.updateVideoHighlight();
            
            this.updateStatus(`Playing: ${video.name}`);
            
        } catch (error) {
            console.error('Error playing video:', error);
            this.updateStatus('Error playing video: ' + error.message);
        }
    }
    
    updateVideoHighlight() {
        // Remove highlight from all video cards
        const videoCards = document.querySelectorAll('.video-card');
        videoCards.forEach(card => card.classList.remove('playing'));
        
        // Highlight current video card
        if (videoCards[this.currentVideoIndex]) {
            videoCards[this.currentVideoIndex].classList.add('playing');
        }
    }
    
    async handleVideoEnded() {
        console.log('Video ended, current index:', this.currentVideoIndex);
        console.log('Total videos:', this.videoFiles.length);
        console.log('Is looping:', this.isLooping);
        
        if (this.isLooping) {
            // Move to next video
            const nextIndex = (this.currentVideoIndex + 1) % this.videoFiles.length;
            
            if (nextIndex === 0 && this.currentVideoIndex === this.videoFiles.length - 1) {
                // We've reached the end, loop back to first video
                this.updateStatus('Looping back to first video');
            }
            
            await this.playVideo(nextIndex);
        }
    }
    
    handleVideoError(error) {
        console.error('Video error:', error);
        this.updateStatus('Error playing video: ' + error.message);
        
        // Try to play next video on error
        if (this.isLooping && this.videoFiles.length > 1) {
            const nextIndex = (this.currentVideoIndex + 1) % this.videoFiles.length;
            this.playVideo(nextIndex);
        }
    }
    
    playPrevious() {
        if (this.videoFiles.length === 0) return;
        
        const prevIndex = this.currentVideoIndex === 0 
            ? this.videoFiles.length - 1 
            : this.currentVideoIndex - 1;
        
        this.playVideo(prevIndex);
    }
    
    playNext() {
        if (this.videoFiles.length === 0) return;
        
        const nextIndex = (this.currentVideoIndex + 1) % this.videoFiles.length;
        this.playVideo(nextIndex);
    }
    
    togglePlayPause() {
        if (this.videoPlayer.paused) {
            this.videoPlayer.play();
        } else {
            this.videoPlayer.pause();
        }
    }
    
    updatePlayPauseButton(isPlaying) {
        if (!this.playPauseIcon) return;
        
        if (isPlaying) {
            this.playPauseIcon.setAttribute('d', 'M6 19h4V5H6v14zm8-14v14h4V5h-4z'); // Pause icon
        } else {
            this.playPauseIcon.setAttribute('d', 'M8 5v14l11-7z'); // Play icon
        }
    }
    
    updateProgress() {
        if (!this.videoPlayer.duration) return;
        
        const progress = (this.videoPlayer.currentTime / this.videoPlayer.duration) * 100;
        this.videoProgress.style.width = progress + '%';
        
        this.currentTime.textContent = this.formatTime(this.videoPlayer.currentTime);
        this.totalTime.textContent = this.formatTime(this.videoPlayer.duration);
    }
    
    seekToPosition(event) {
        if (!this.videoPlayer.duration) return;
        
        const rect = this.videoProgressBar.getBoundingClientRect();
        const position = (event.clientX - rect.left) / rect.width;
        const newTime = position * this.videoPlayer.duration;
        
        this.videoPlayer.currentTime = newTime;
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.videoPlayer.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
    
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    updateStatus(message) {
        if (this.statusText) {
            this.statusText.textContent = message;
        }
        console.log('Status:', message);
        
        // Show status bar temporarily
        if (this.statusBar) {
            this.statusBar.style.display = 'block';
            setTimeout(() => {
                this.statusBar.style.display = 'none';
            }, 3000);
        }
    }
    
    slidePrev() {
        // Implement slide navigation if needed
        console.log('Slide previous');
    }
    
    slideNext() {
        // Implement slide navigation if needed
        console.log('Slide next');
    }
    
    slideContinuePrev() {
        // Implement continue watching slide navigation if needed
        console.log('Continue slide previous');
    }
    
    slideContinueNext() {
        // Implement continue watching slide navigation if needed
        console.log('Continue slide next');
    }
}

// Initialize the video player when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const videoPlayer = new VideoPlayer();
    console.log('Video Player initialized');
});
