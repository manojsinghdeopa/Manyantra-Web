import * as firebase from './firebase.js';


const { auth, analytics, db, signInAnonymously, logEvent, collection, query, where, getDocs, startAfter, limit } = firebase;


const BOOKS_COLLECTION = 'books';
const BOOKS_LIMIT = 5;


const loadingSpinnerElement = document.getElementById('loadingSpinner');
const contentListElement = document.getElementById('contentList');

let radioPlayer = null;
let isPlaying = false;



let lastDocument = null;
let selectedContentType = '';
let contentTypeList = null;
let deferredPrompt;


const languages = [
    { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
    { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷' },
    { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
    { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹' },
    { code: 'nl', name: 'Dutch', native: 'Nederlands', flag: '🇳🇱' },
    { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
    { code: 'sv', name: 'Swedish', native: 'Svenska', flag: '🇸🇪' },
    { code: 'pl', name: 'Polish', native: 'Polski', flag: '🇵🇱' },
    { code: 'he', name: 'Hebrew', native: 'עברית', flag: '🇮🇱' },
    { code: 'th', name: 'Thai', native: 'ไทย', flag: '🇹🇭' },
    { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳' },

    // 🇮🇳 Popular Indian Languages
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'ur', name: 'Urdu', native: 'اُردُو', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
    { code: 'as', name: 'Assamese', native: 'অসমীয়া', flag: '🇮🇳' },
    { code: 'ma', name: 'Maithili', native: 'मैथिली', flag: '🇮🇳' },
    { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्', flag: '🇮🇳' },
    { code: 'bho', name: 'Bhojpuri', native: 'भोजपुरी', flag: '🇮🇳' },
    { code: 'ks', name: 'Kashmiri', native: 'کٲشُر', flag: '🇮🇳' },
    { code: 'sd', name: 'Sindhi', native: 'سنڌي', flag: '🇮🇳' },
    { code: 'ne', name: 'Nepali', native: 'नेपाली', flag: '🇳🇵' },
    { code: 'mni', name: 'Manipuri', native: 'ꯃꯅꯤꯄꯨꯔꯤ', flag: '🇮🇳' },
    { code: 'doi', name: 'Dogri', native: 'डोगरी', flag: '🇮🇳' },
    { code: 'kok', name: 'Konkani', native: 'कोंकणी', flag: '🇮🇳' },

    // 🇵🇰 & 🇧🇩 Neighboring Country Languages
    { code: 'ps', name: 'Pashto', native: 'پښتو', flag: '🇵🇰' },
    { code: 'fa', name: 'Persian', native: 'فارسی', flag: '🇮🇷' },
    { code: 'si', name: 'Sinhala', native: 'සිංහල', flag: '🇱🇰' },
];




loadContentTypes();

setupRadioPlayer();

authanticate();

setupFloatingFab();

promptCheck();



function setupFloatingFab() {


    const mainFab = document.getElementById('mainFab');
    const fabMenu = document.getElementById('fabMenu');

    let isMenuOpen = false;

    mainFab.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        fabMenu.classList.toggle('visible');
        mainFab.textContent = isMenuOpen ? '❌' : '👆';
    });



    document.getElementById("playFab").addEventListener("click", () => {
        const playFab = document.getElementById("playFab");
        if (isPlaying) {
            radioPlayer.pause();
            playFab.textContent = "🎵";  // Reset to play icon
        } else {
            radioPlayer.play().catch(err => console.error("Error playing radio:", err));
            playFab.textContent = "🛑";  // Show pause icon
        }
        isPlaying = !isPlaying;
    });


    document.getElementById("languageFab").addEventListener("click", () => {

        const languageModalContent = document.getElementById('languageModalContent');
        // Clone modal content and rebuild the language list with listeners
        const clonedContent = languageModalContent.cloneNode(true);
        const languageList = clonedContent.querySelector('#languageList');
        languageList.innerHTML = ''; // Clear any stale list

        languages.forEach(language => {
            const listItem = document.createElement('li');
            listItem.classList.add('language-option');
            listItem.innerHTML = `${language.flag} ${language.name} (${language.native})`;

            listItem.addEventListener('click', async () => {
                localStorage.setItem('selectedLanguage', language.code);
                loadContentTypes();

                // Close the popup modal
                if (currentPopUpElementModal) {
                    document.body.removeChild(currentPopUpElementModal);
                    currentPopUpElementModal = null;
                }
            });

            languageList.appendChild(listItem);
        });

        openPopUpWindowWithElement(clonedContent);
    });

    document.getElementById("profileFab").addEventListener("click", () => {
        openPopUpWindow('editor.html');
    });

    document.getElementById("assistantFab").addEventListener("click", () => {
        openPopUpWindow('assistant.html')
    });
}



function promptCheck() {
    if (navigator.userAgent.toLowerCase().includes('instagram')) {
        showCustomAlert("Please open www.manyantra.com in browser for better experience");
    } else {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            deferredPrompt = e;
            showInstallPrompt();
        });
    }
}


// Alerts

function showCustomAlert(message) {
    const existing = document.getElementById('customAlertBox');
    if (existing) existing.remove(); // Avoid duplicates

    const alertBox = document.createElement('div');
    alertBox.id = 'customAlertBox';
    alertBox.style.position = 'fixed';
    alertBox.style.bottom = '100px';
    alertBox.style.left = '50%';
    alertBox.style.transform = 'translateX(-50%)';
    alertBox.style.background = '#fffbe6';
    alertBox.style.border = '1px solid #ffe58f';
    alertBox.style.padding = '1rem';
    alertBox.style.borderRadius = '12px';
    alertBox.style.maxWidth = '320px';
    alertBox.style.width = '90%';
    alertBox.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    alertBox.style.zIndex = '1000';
    alertBox.style.fontFamily = 'sans-serif';
    alertBox.style.fontSize = '0.95rem';
    alertBox.style.textAlign = 'center';

    alertBox.innerHTML = `
        ${message}
        <br><br>
        <button id="alertCloseBtn" style="padding: 0.4rem 1rem; background: #445F87; color: white; border: none; border-radius: 6px; cursor: pointer;">
            OK
        </button>
    `;

    document.body.appendChild(alertBox);

    document.getElementById('alertCloseBtn').addEventListener('click', () => {
        alertBox.remove();
    });
}

function showInstallPrompt() {
    const installPrompt = document.createElement('div');
    installPrompt.style.position = 'fixed';
    installPrompt.style.bottom = '100px';
    installPrompt.style.left = '20px';
    installPrompt.style.right = '20px';
    installPrompt.style.padding = '1rem';
    installPrompt.style.background = '#fff';
    installPrompt.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    installPrompt.style.borderRadius = '12px';
    installPrompt.style.zIndex = '1000';

    installPrompt.innerHTML = `
        <div style="font-size: 1rem; margin-bottom: 0.5rem;">
            Install Manyantra to your home screen for a best experience.
        </div>
        <div style="display: flex; gap: 0.5rem;">
            <button id="installAppBtn" style="padding: 0.5rem 1rem; background: #445F87; color: white; border: none; border-radius: 6px; cursor: pointer;">
                Install
            </button>
            <button id="cancelInstallBtn" style="padding: 0.5rem 1rem; background: #ccc; color: #333; border: none; border-radius: 6px; cursor: pointer;">
                Cancel
            </button>
        </div>
    `;

    document.body.appendChild(installPrompt);

    // Install button logic
    document.getElementById('installAppBtn').addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            deferredPrompt = null;
            document.body.removeChild(installPrompt);
        }
    });

    // Cancel button logic
    document.getElementById('cancelInstallBtn').addEventListener('click', () => {
        document.body.removeChild(installPrompt);
    });
}



// AUTH 

function authanticate() {
    auth.onAuthStateChanged(user => {
        if (user) {
            localStorage.setItem('uid', user.uid);
        } else {
            signInAnonymously(auth).then(cred => {
                localStorage.setItem('uid', cred.user.uid);
            });
        }
    });
}




// Content type list

async function loadContentTypes() {
    try {
        const response = await fetch('contentTypeList.json');
        if (!response.ok) {
            throw new Error('Failed to load content types.');
        }
        const data = await response.json();
        contentTypeList = data.content_type_list.map(contentType => ({
            originalName: contentType,
            translatedName: '' // Placeholder for translated name
        }));

        if (contentTypeList && contentTypeList.length > 0) {
            // Translate all content types at once
            await translateContentTypes(contentTypeList);
        }

        displayContentTypes();

    } catch (error) {
        console.error('Error loading content types:', error);
    }
}

async function translateContentTypes(contentTypes) {
    try {
        const translations = await Promise.all(contentTypes.map(async (contentType) => {
            const translatedContentType = await translateText(contentType.originalName);
            return translatedContentType;
        }));

        // After all translations are complete, assign them back to contentTypeList
        contentTypes.forEach((contentType, index) => {
            contentType.translatedName = translations[index];
        });
    } catch (error) {
        console.error('Error translating content types:', error);
    }
}

async function translateText(text) {
    try {
        const response = await fetch(
            `https://translation.googleapis.com/language/translate/v2?key=AIzaSyBkuxn-RDRAwrRKWbyl4Ef4m05aklyhSpA`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    q: text,
                    target: localStorage.getItem('selectedLanguage') || 'en',
                }),
            }
        );
        const data = await response.json();
        return data.data.translations[0].translatedText;
    } catch (error) {
        // console.error('Error translating text:', error);
        return text;  // Fallback to original text if translation fails
    }
}

function displayContentTypes() {
    const fragment = document.createDocumentFragment();
    // Shuffle the content type list
    contentTypeList.sort(() => Math.random() - 0.5);
    contentTypeList.forEach((contentType) => {
        const card = createContentTypeCard(
            contentType.translatedName || contentType.originalName  // Display translated or original content type
        );
        card.addEventListener('click', () => fetchBooksForContentType(contentType.originalName));
        fragment.appendChild(card);
    });

    contentListElement.innerHTML = '';
    contentListElement.appendChild(fragment);
    hideLoading();
}



// Content type's data
function fetchBooksForContentType(contentType) {

    selectedContentType = contentType;
    const contentTypeQuery = query(
        collection(db, BOOKS_COLLECTION),
        where('content_type', '==', contentType),
        limit(BOOKS_LIMIT)
    );

    fetchBooks(contentTypeQuery);
}

function getNextQuery() {
    return query(
        collection(db, BOOKS_COLLECTION),
        where('content_type', '==', selectedContentType),
        startAfter(lastDocument),
        limit(BOOKS_LIMIT)
    );
}

async function translateBook(book) {
    try {
        const response = await fetch(
            `https://translation.googleapis.com/language/translate/v2?key=AIzaSyBkuxn-RDRAwrRKWbyl4Ef4m05aklyhSpA`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    q: [book.title],
                    target: localStorage.getItem('selectedLanguage') || 'en',
                }),
            }
        );
        const data = await response.json();
        book.title = data.data.translations[0].translatedText; // Update the book title
    } catch (error) {
        // console.error('Error translating book:', error);
    }
    return book; // Return the updated book object
}

async function fetchBooks(q) {
    try {
        showLoading();
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            hideLoading();
            console.log('No more books to display.');
            return;
        }

        const fragment = document.createDocumentFragment();
        let isFirst = true;

        const translatedBooks = await Promise.all(
            snapshot.docs.map(async (doc) => {
                let data = doc.data();
                if (isFirst) {
                    data = await translateBook(data);
                    isFirst = false;
                }
                return { data, id: doc.id };
            })
        );

        translatedBooks.forEach(({ data, id }) => {
            const card = createCard(data);
            card.addEventListener('click', () => showDetail(data, id));
            fragment.appendChild(card);
        });

        // Book list container (grid layout)
        const bookListContainer = document.createElement('div');
        bookListContainer.className = 'book-list';
        bookListContainer.style.display = 'grid';
        bookListContainer.style.gap = '1rem';
        bookListContainer.appendChild(fragment);

        // Next button wrapper to align right
        const nextBtnWrapper = document.createElement('div');
        nextBtnWrapper.style.display = 'flex';
        nextBtnWrapper.style.justifyContent = 'flex-end';
        nextBtnWrapper.style.marginTop = '1rem';
        nextBtnWrapper.style.marginBottom = '1.5rem';

        const nextBtn = document.createElement('button');
        nextBtn.innerText = 'Next';
        nextBtn.style.padding = '0.5rem 1rem';
        nextBtn.style.fontSize = '1rem';
        nextBtn.style.cursor = 'pointer';
        nextBtn.style.border = '1px solid #ccc';
        nextBtn.style.borderRadius = '4px';
        nextBtn.style.backgroundColor = '#f5f5f5';

        nextBtn.addEventListener('click', nextBtnClick);
        nextBtnWrapper.appendChild(nextBtn);

        // Outer wrapper (no max height or scroll)
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.gap = '1rem';

        wrapper.appendChild(bookListContainer);
        wrapper.appendChild(nextBtnWrapper);

        openPopUpWindowWithElement(wrapper);

        hideLoading();
        updateLastDocument(snapshot);
    } catch (error) {
        console.error('Error fetching books:', error);
        hideLoading();
    }
}









// UI FUNCTIONS

function nextBtnClick() {
    if (lastDocument) {
        const nextQuery = getNextQuery();
        fetchBooks(nextQuery);
    } else {
        hideLoading();
    }
}

function showDetail(data, id) {
    localStorage.setItem('title', data.title);
    sessionStorage.setItem('data', JSON.stringify(data));
    const titleForUrl = data.title.replace(/[\W_]+/g, '-');
    const readerPageUrl = `reader.html?title=${titleForUrl}&id=${id}`;
    openPopUpWindow(readerPageUrl);
    // window.open(readerPageUrl);
    logEvent(analytics, 'article_read', { title: data.title, content_type: data.content_type });
}


function updateLastDocument(snapshot) {
    lastDocument = snapshot.docs[snapshot.docs.length - 1];
}


function createContentTypeCard(contentType) {
    const text = createElementWithClass('p', 'animated-text');
    animateText(text, contentType);
    const card = createElementWithClass('div', 'staggered-card', {}, [text]);
    return card;
}


function createCard(data) {
    const image = createElementWithClass('img', 'book-image', { src: data.icon, alt: data.title, width: '100', height: '115' });
    const imageContainer = createElementWithClass('div', 'image-container', {}, [image]);
    const title = createElementWithClass('h3', 'title');
    const textContainer = createElementWithClass('div', 'text-container', {}, [title]);
    const card = createElementWithClass('div', 'card', {}, [imageContainer, textContainer]);

    animateText(title, data.title || 'Title');
    return card;
}

function animateText(element, text, duration = 777) {
    const characters = text.split('');
    let index = 0;
    const interval = duration / text.length;

    const timer = setInterval(() => {
        if (index < characters.length) {
            element.textContent += characters[index];
            index++;
        } else {
            clearInterval(timer);
        }
    }, interval);
}


function createElementWithClass(elementType, className, attributes = {}, children = []) {
    const element = document.createElement(elementType);
    element.classList.add(className);
    Object.entries(attributes).forEach(([key, value]) => element[key] = value);
    children.forEach(child => element.appendChild(child));
    return element;
}


function setupRadioPlayer() {

    radioPlayer = document.getElementById('radioPlayer');
    isPlaying = false;
    const radioSrc = "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio002/hlspbaudio00264kbps.m3u8";
    let hls;

    if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(radioSrc);
        hls.attachMedia(radioPlayer);

        hls.on(Hls.Events.ERROR, (event, data) => {
            console.error("HLS.js error:", data);
        });
    } else if (radioPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        // Fallback for Safari
        radioPlayer.src = radioSrc;
    } else {
        console.error("HLS format is not supported on this browser.");
    }
}

function showLoading() {
    loadingSpinnerElement.style.display = 'flex';
}

function hideLoading() {
    loadingSpinnerElement.style.display = 'none';
}

function openPopUpWindow(pageUrl) {
    // Create the modal container
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    // Create the modal content box for full-screen display
    const modalContent = document.createElement('div');
    modalContent.style.width = '100%';
    modalContent.style.height = '100%';
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.overflow = 'hidden';
    modalContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    modalContent.style.position = 'relative';
    modalContent.style.paddingTop = '100px'; // Add 100px top padding

    // Create the close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.padding = '10px 15px';
    closeButton.style.backgroundColor = '#ff4d4d';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.zIndex = '1001'; // Ensure it appears above other elements

    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    // Create the iframe to load the page
    const iframe = document.createElement('iframe');
    iframe.src = pageUrl;
    iframe.style.width = '100%';
    iframe.style.height = 'calc(100% - 50px)'; // Adjust height to accommodate padding
    iframe.style.border = 'none';

    // Ensure the close button stays in place regardless of padding
    modal.appendChild(closeButton); // Move the button outside modalContent
    modalContent.appendChild(iframe);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

let currentPopUpElementModal = null;
function openPopUpWindowWithElement(contentElement) {
    // If there's an existing modal, remove it first
    if (currentPopUpElementModal) {
        document.body.removeChild(currentPopUpElementModal);
        currentPopUpElementModal = null;
    }

    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    const modalContent = document.createElement('div');
    modalContent.style.width = '90%';
    modalContent.style.height = '90%';
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.overflow = 'auto';
    modalContent.style.position = 'relative';
    modalContent.style.padding = '100px 20px 20px 20px';
    modalContent.style.borderRadius = '12px';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.padding = '10px 15px';
    closeButton.style.backgroundColor = '#ff4d4d';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.zIndex = '1001';

    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
        currentPopUpElementModal = null;
    });

    modalContent.appendChild(contentElement);
    modal.appendChild(closeButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Save reference
    currentPopUpElementModal = modal;
}



