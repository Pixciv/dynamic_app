
const files = [
  "altinlale",
  "ayakkabikoyuvecuceler",
  "beklenmeyensans",
  "birelmabirders",
  "biroyunmacerasi",
  "buyucuanne",
  "buyulukitap",
  "cadilarkoyu",
  "ciftcininsalataligi",
  "devvekoyluler",
  "garipcocukvekoltuk",
  "gokkusagigunu",
  "goktasi",
  "gorunmezlikceketi",
  "hataninsonucu",
  "iyilikvekotuluk",
  "kayipkalp",
  "ruyalarsatosu",
  "sakaci",
  "sebzelerulkesi",
  "sevgiherseydendegerli",
  "sihirliayakkabilar",
  "sihirlicanta",
  "sihirlidolap",
  "ucurtmapapi",
  "zamaninonemi",
  "zamanmakinesi"
];

const titles = {
  "altinlale": "Altın Lale",
  "ayakkabikoyuvecuceler": "Ayakkabı Köyü ve Cüceler",
  "beklenmeyensans": "Beklenmeyen Şans",
  "birelmabirders": "Bir Elma Bir Ders",
  "biroyunmacerasi": "Bir Oyun Macerası",
  "buyucuanne": "Büyücü Anne",
  "buyulukitap": "Büyülü Kitap",
  "cadilarkoyu": "Cadılar Köyü",
  "ciftcininsalataligi": "Çiftçinin Salatalığı",
  "devvekoyluler": "Dev ve Köylüler",
  "garipcocukvekoltuk": "Garip Çocuk ve Koltuk",
  "gokkusagigunu": "Gökkuşağı Günü",
  "goktasi": "Gök Taşı",
  "gorunmezlikceketi": "Görünmezlik Ceketi",
  "hataninsonucu": "Hatanın Sonucu",
  "iyilikvekotuluk": "İyilik ve Kötülük",
  "kayipkalp": "Kayıp Kalp",
  "ruyalarsatosu": "Rüyalar Şatosu",
  "sakaci": "Şakacı",
  "sebzelerulkesi": "Sebzeler Ülkesi",
  "sevgiherseydendegerli": "Sevgi Her Şeyden Değerli",
  "sihirliayakkabilar": "Sihirli Ayakkabılar",
  "sihirlicanta": "Sihirli Çanta",
  "sihirlidolap": "Sihirli Dolap",
  "ucurtmapapi": "Uçurtma Papi",
  "zamaninonemi": "Zamanın Önemi",
  "zamanmakinesi": "Zaman Makinesi"
};

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

const container = document.getElementById('stories');
let currentAudio = null;
let currentButton = null;
let currentCard = null;

// "Masallara Geri Dön" butonunu oluşturup container içine ekliyoruz
const backButton = document.createElement('button');
backButton.id = "backButton";
backButton.textContent = "Masallara Geri Dön";
backButton.style.display = "none";
// CSS stilleri app.js yerine style.css dosyasında yönetildiği için buradan kaldırıldı.
// Ancak, eğer doğrudan JavaScript'ten stil vermek gerekiyorsa, buraya eklenebilir.

backButton.addEventListener('click', () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  if (currentButton) currentButton.textContent = 'Dinle';
  if (currentCard) currentCard.classList.remove('playing');

  // Tüm kartları tekrar göster
  Array.from(container.children).forEach(c => {
    if (c !== backButton) c.style.display = 'block';
  });

  // Butonu gizle
  backButton.style.display = 'none';

  // Temizle
  currentAudio = null;
  currentButton = null;
  currentCard = null;
});

container.appendChild(backButton);

/**
 * Zaman formatlama (ör: 1:04, 0:59)
 */
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Masal slug'ını okunabilir başlığa çevir
 */
function formatTitle(slug) {
  return titles[slug] || slug
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .split(/[\s-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function sortCards() {
  const cards = Array.from(container.children).filter(c => c.classList && c.classList.contains('story-card'));
  cards.sort((a, b) => {
    const aFav = a.classList.contains('favorited') ? -1 : 1;
    const bFav = b.classList.contains('favorited') ? -1 : 1;
    return aFav - bFav;
  });
  cards.forEach(card => container.insertBefore(card, backButton));
}

files.forEach(name => {
  const card = document.createElement('div');
  card.className = 'story-card';

  // Favori butonu
  const favBtn = document.createElement('button');
  favBtn.className = 'favorite-toggle';
  favBtn.innerHTML = favorites.includes(name) ? '❤️' : '🤍';
  card.classList.toggle('favorited', favorites.includes(name));

  favBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // ses çalmayı engelle
    if (favorites.includes(name)) {
      favorites = favorites.filter(f => f !== name);
    } else {
      favorites.push(name);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    favBtn.innerHTML = favorites.includes(name) ? '❤️' : '🤍';
    card.classList.toggle('favorited', favorites.includes(name));
    sortCards();
  });

  // Resim
  const img = document.createElement('img');
  img.src = `${name}.jpg`;
  img.alt = formatTitle(name);

  // Başlık
  const title = document.createElement('h3');
  title.textContent = formatTitle(name);

  // Dinle / Dur / Devam Et butonu
  const button = document.createElement('button');
  button.textContent = 'Dinle';

  // Geri sarma butonu
  const rewindBtn = document.createElement('button');
  rewindBtn.className = 'circle-skip';
  rewindBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      class="lucide lucide-rotate-ccw">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
    </svg>
  `;
  rewindBtn.addEventListener('click', () => {
    if (currentAudio) {
      currentAudio.currentTime = Math.max(0, currentAudio.currentTime - 10);
    }
  });

  // İleri sarma butonu
  const forwardBtn = document.createElement('button');
  forwardBtn.className = 'circle-skip';
  forwardBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      class="lucide lucide-rotate-cw">
      <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/>
    </svg>
  `;
  forwardBtn.addEventListener('click', () => {
    if (currentAudio) {
      currentAudio.currentTime = Math.min(currentAudio.duration, currentAudio.currentTime + 10);
    }
  });

  // İlerleme çubuğu
  const progressContainer = document.createElement('div');
  progressContainer.className = 'progress-container';

  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  progressContainer.appendChild(progressBar);

  // Zaman göstergesi
  const timeDisplay = document.createElement('div');
  timeDisplay.className = 'time-display';
  timeDisplay.textContent = '00:00 / 00:00';

  const audio = new Audio(`${name}.mp3`);
  audio.preload = "auto";

  button.addEventListener('click', () => {
    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      if (currentButton) currentButton.textContent = 'Dinle';
      if (currentCard) currentCard.classList.remove('playing');
      Array.from(container.children).forEach(c => {
        if (c !== backButton) c.style.display = 'block';
      });
      backButton.style.display = 'none';
    }

    if (audio.paused) {
      if (audio.currentTime === 0) {
        progressBar.style.width = '0%';
        timeDisplay.textContent = '00:00 / ' + formatTime(audio.duration);
      }
      audio.play();
      currentAudio = audio;
      currentButton = button;
      currentCard = card;

      Array.from(container.children).forEach(c => {
        if (c !== card && c !== backButton) c.style.display = 'none';
      });
      card.style.display = 'block';
      backButton.style.display = 'inline-block';
      card.classList.add('playing');
      button.textContent = 'Dur';

      audio.ontimeupdate = () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = percent + '%';
        timeDisplay.textContent = formatTime(audio.currentTime) + ' / ' + formatTime(audio.duration);
      };
    } else {
      audio.pause();
      if (audio.currentTime > 0 && audio.currentTime < audio.duration) {
        button.textContent = 'Dinlemeye Devam Et';
      } else {
        button.textContent = 'Dinle';
        progressBar.style.width = '0%';
        timeDisplay.textContent = '00:00 / 00:00';
      }
    }
  });

  audio.addEventListener('ended', () => {
    button.textContent = 'Dinle';
    progressBar.style.width = '0%';
    timeDisplay.textContent = '00:00 / 00:00';
    backButton.style.display = 'none';

    if (currentAudio === audio) {
      currentAudio = null;
      currentButton = null;
      if (currentCard) currentCard.classList.remove('playing');
      currentCard = null;
      Array.from(container.children).forEach(c => {
        if (c !== backButton) c.style.display = 'block';
      });
    }
  });

  // Hepsini sırayla kart öğesine ekle
  card.appendChild(favBtn);
  card.appendChild(img);
  card.appendChild(title); // Başlık doğrudan ekleniyor

  // Dinle, Geri ve İleri sarma butonlarını içeren bir div oluştur
  const playbackControls = document.createElement('div');
  playbackControls.style.display = 'flex';
  playbackControls.style.alignItems = 'center';
  playbackControls.style.justifyContent = 'center'; // Ortalamak için
  playbackControls.style.gap = '12px';
  playbackControls.style.marginTop = '10px';

  playbackControls.appendChild(rewindBtn);
  playbackControls.appendChild(button);
  playbackControls.appendChild(forwardBtn);

  card.appendChild(playbackControls); // Kontrolleri karta ekle
  card.appendChild(progressContainer);
  card.appendChild(timeDisplay);

  container.insertBefore(card, backButton);
});

sortCards();

// 🌙 Gece Modu Toggle
const toggleBtn = document.getElementById('modeToggle');
const themeMeta = document.getElementById('themeColor');

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  toggleBtn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  themeMeta.setAttribute("content", document.body.classList.contains('dark') ? "#1c1c1e" : "#ffffff");
});
