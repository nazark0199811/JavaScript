
class Carousel{
    constructor(params) {
    const settings = (() => ({...{containerID: '#carousel', slideID :'.slide', interval : 1000, isPlaying : true},...params}))(); 

    this.container = document.querySelector(settings.containerID);
    this.slides = this.container.querySelectorAll(settings.slideID);

    this.interval = settings.interval;
    this.isPlaying = settings.isPlaying;
    }

    _initProps(){
        this.currentSlide = 0;
        this.timerID = null;
        this.swipeStartX = null;
        this.swipeEndX = null;
    
        this.SLIDES_COUNT = this.slides.length;
        this.SPACE = '';
        this.LEFT_ARROW = 'ArrowLeft';
        this.RIGHT_ARROW = 'ArrowRight';
        this.FA_PAUSE = '<i class="far fa-pause-circle"></i>';
        this.FA_PLAY = '<i class="far fa-play-circle"></i>';
        this.FA_PREV = '<i class="fas fa-angle-left"></i>';
        this.FA_NEXT = '<i class="fas fa-angle-right"></i>';
    }

    _initControls(){
        const controls = document.createElement('div');

        const PAUSE = `<span class="control control-pause" id="pause-btn">${this.isPlaying ? this.FA_PAUSE : this.FA_PLAY}</span>`;
        const PREV = `<span class="control control-prev" id="prev-btn">${this.FA_PREV}</span>`;
        const NEXT = `<span class="control control-next" id="next-btn">${this.FA_NEXT}</span>`;

        controls.setAttribute('class', 'controls');
        controls.innerHTML = PAUSE + PREV + NEXT;

        this.container.appendChild(controls);

        this.pauseBtn = this.container.querySelector('#pause-btn');
        this.prevBtn = this.container.querySelector('#prev-btn');
        this.nextBtn = this.container.querySelector('#next-btn');
    }


    _initIndicators(){
        const indicators = document.createElement('div');
        
        indicators.setAttribute('class', 'indicators');

        for (let i = 0, n = this.SLIDES_COUNT; i < n; i++) {
            const indicator = document.createElement('div');
            indicator.setAttribute('class', 'indicator');
            indicator.setAttribute('data-slide-to', `${i}`);

            if (i === 0) {
                indicator.classList.add('active');
            }

            indicators.appendChild(indicator);
        }

        this.container.appendChild(indicators);
        this.indicatorsContainer = this.container.querySelector('.indicators');
        this.indicators = this.indicatorsContainer.querySelectorAll('.indicator');
    }

    _initListeners() {
        this.pauseBtn.addEventListener('click', this.pausePlay.bind(this));
        this.prevBtn.addEventListener('click', this.prev.bind(this));
        this.nextBtn.addEventListener('click', this.next.bind(this));
        this.indicatorsContainer.addEventListener('click', this.indicate.bind(this));
        document.addEventListener('keydown', this.pressKey.bind(this));  
        this.container.addEventListener('mouseenter', this.pause.bind(this))
        this.container.addEventListener('mouseleave', this.play.bind(this))
    }

     gotoSlide(n) {
        this.slides[this.currentSlide].classList.toggle('active');
        this.indicators[this.currentSlide].classList.toggle('active');
        this.currentSlide =( n + this.SLIDES_COUNT) % this.SLIDES_COUNT;
        this.indicators[this.currentSlide].classList.toggle('active');
        this.slides[this.currentSlide].classList.toggle('active');
    }

    prevSlide() {
        this.gotoSlide(this.currentSlide - 1);
    }
   
    nextSlide(){
        this.gotoSlide(this.currentSlide + 1);
    }
   
   
    pause() {
        if (this.isPlaying) {
            clearInterval(this.timerID);
            this.pauseBtn.innerHTML = this.FA_PLAY;
            this.isPlaying = !this.isPlaying;
        }
    }
   
    play() {
        this.timerID = setInterval(() => this.nextSlide(), this.interval);
        this.pauseBtn.innerHTML = this.FA_PAUSE;
        this.isPlaying = !this.isPlaying;
    }

    pausePlay(){
          this.isPlaying ? this.pause() : this.play();   
    }

    prev() {
        this.pause();
        this.prevSlide();
    }
            
    next() {
        this.pause();
        this.nextSlide();
    }
   
    indicate(e) {
         const target = e.target;
            
        if(target.classList.contains('indicator')){
        this.pause();
        this.gotoSlide(+target.getAttribute('data-slide-to'));
        }
    }
            
    pressKey(e){
        if(e.key === this.RIGHT_ARROW) this.next();
        if(e.key === this.LEFT_ARROW) this.prev();
        if(e.key === this.SPACE) this.pausePlay();
    }

    init() {
        this._initProps();
        this._initControls();
        this._initIndicators();
        this._initListeners();
        if(this.isPlaying){
            this.timerID = setInterval(() => this.nextSlide(), this.interval);
        }
    }
}

class SwipeCarousel extends Carousel{
    swipeStart(e) {
        this.swipeStartX = e.changedTouches[0].pageX;
    }

    swipeEnd(e) {
        this.swipeEndX = e.changedTouches[0].pageX;
        this.swipeStartX - this.swipeEndX > 100 && this.next();
        this.swipeStartX - this.swipeEndX < -100 && this.prev();
    }

    _initListeners(){
        super._initListeners();
        this.container.addEventListener('touchstart', this.swipeStart.bind(this))
        this.container.addEventListener('touchend', this.swipeEnd.bind(this)) 
    }
}
