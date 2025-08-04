let move_speed = 3, gravity = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');

// Daftar latar belakang
let backgrounds = [ 'images/gambark.jpg', 'images/gambaro.jpg','images/gambart.jpg','images/gambar14.jpg'];
let current_bg_index = 0; // Indeks latar belakang saat ini

// Mendapatkan elemen latar belakang
let background_element = document.querySelector('.background');

// Mendapatkan properti elemen burung dan latar belakang
let bird_props = bird.getBoundingClientRect();
let background = background_element.getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');

let score = 0;
let highest_score = localStorage.getItem('highest_score') || 0;

// Menambahkan elemen musik latar
let music = document.getElementById('background-music');

// Event listener untuk mulai permainan
document.addEventListener('keydown', (e) => {
    if (e.key == 'Enter' && game_state != 'Play') {
        document.querySelectorAll('.pipe_sprite').forEach((e) => {
            e.remove();
        });
        img.style.display = 'block';
        bird.style.top = '40vh';
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');

        // Mulai musik saat permainan dimulai
        music.play();
        play();
    }
});

// Fungsi utama permainan
function play() {
    let bird_dy = 0;

    function move() {
        if (game_state != 'Play') return;

        // Periksa jika skor merupakan kelipatan dari 5 dan tingkatkan kecepatan
        if (score > 0 && score % 5 === 0 && move_speed <= 5) {
            move_speed += 0.1;
        }

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            if (pipe_sprite_props.right <= 0) {
                element.remove();
            } else {
                if (bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
                    bird_props.left + bird_props.width > pipe_sprite_props.left &&
                    bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
                    bird_props.top + bird_props.height > pipe_sprite_props.top) {
                    
                    game_state = 'End';
                    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';

                    if (score > highest_score) {
                        highest_score = score;
                        message.innerHTML += `<br>New High Score: ${score}`;
                        localStorage.setItem('highest_score', highest_score);
                    } else {
                        message.innerHTML += `<br>Highest Score: ${highest_score}`;
                    }

                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                    sound_die.play();
                    music.pause();
                    music.currentTime = 0;
                    return;
                } else {
                    if (pipe_sprite_props.right < bird_props.left && pipe_sprite_props.right + move_speed >= bird_props.left && element.increase_score == '1') {
                        score++;
                        score_val.innerHTML = score;
                        sound_point.play();

                        // Ganti latar belakang jika skor kelipatan 10
                        if (score % 10 === 0) {
                            current_bg_index = (current_bg_index + 1) % backgrounds.length;
                            background_element.style.backgroundImage = `url(${backgrounds[current_bg_index]})`;
                        }
                    }
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });

        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    // Fungsi untuk menerapkan gravitasi
    function apply_gravity() {
        if (game_state != 'Play') return;

        bird_dy = bird_dy + gravity;

        // Menambahkan kontrol untuk naik
        document.addEventListener('keydown', (e) => {
            if (e.key == 'ArrowUp' || e.key == ' ') {
                img.src = 'images/Bird-2.png';
                bird_dy = -7.6;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key == 'ArrowUp' || e.key == ' ') {
                img.src = 'images/Bird.png';
            }
        });

        // Periksa jika burung keluar dari batas atas atau bawah
        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            game_state = 'End';
            message.style.left = '28vw';
            window.location.reload();
            message.classList.remove('messageStyle');
            music.pause();
            music.currentTime = 0;
            return;
        }
        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    let pipe_seperation = 0;
    let pipe_gap = 35;

    // Fungsi untuk membuat pipa secara acak
    function create_pipe() {
        if (game_state != 'Play') return;

        if (pipe_seperation > 115) {
            pipe_seperation = 0;

            let pipe_posi = Math.floor(Math.random() * 43) + 8;
            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
            pipe_sprite_inv.style.left = '100vw';

            document.body.appendChild(pipe_sprite_inv);
            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1';

            document.body.appendChild(pipe_sprite);
        }
        pipe_seperation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}
