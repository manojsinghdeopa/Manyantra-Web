// JavaScript for editor.html (module)
import { auth, db, collection, query, where, getDocs, deleteDoc, doc, getDoc } from './firebase.js';
import { translateText, translateTexts } from './translation-utils.js';
const booksCollectionRef = collection(db, 'books');
const booksGridContainer = document.querySelector('.grid-container');
import { streamGenerateText } from "./assistant-helper.js";
const labelTextEl = document.getElementById("label-text");
const editorEl = document.getElementById("editor");
const titleEl = document.getElementById("book-title");

async function fetchImageByTitle(title) {
    const url = `https://pixabay.com/api/?key=49657160-a152b5ae10e5ac6c6af772a3f&q=${encodeURIComponent(title)}&image_type=photo&orientation=vertical`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.hits && data.hits.length > 0) {
        return data.hits[0].previewURL;
    } else {
        throw new Error("No image found for this title.");
    }
}


labelTextEl.addEventListener("click", async () => {
    const title = titleEl.innerText.trim();
    if (!title) {
        const translatedTextAlert = await translateText("Please enter a title first.");
        showCustomAlert(translatedTextAlert);
        return;
    }
    const prompt = `Write an article about: ${title}`;
    editorEl.innerHTML = "";
    editorEl.classList.add("loading");
    await streamGenerateText(prompt, (htmlChunk) => {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = htmlChunk;
        editorEl.appendChild(wrapper);
        editorEl.scrollTop = editorEl.scrollHeight;
    });
    try {
        const imageUrl = await fetchImageByTitle(title);
        document.getElementById('cover-preview').innerHTML = `<img src="${imageUrl}" alt="Cover Photo">`;
        document.getElementById('book-cover').setAttribute('data-url', imageUrl);
    } catch (error) {
        console.error("Could not fetch cover image:", error);
    }
    editorEl.classList.remove("loading");
});

fetchContentTypeList();
async function fetchContentTypeList() {
    try {
        const response = await fetch('contentTypeList.json');
        if (!response.ok) {
            throw new Error('Failed to load content types.');
        }
        const data = await response.json();
        const contentTypes = data.content_type_list;
        contentTypes.sort((a, b) => a.localeCompare(b));
        const selectElement = document.querySelector('#book-content-type');
        contentTypes.forEach((contentType) => {
            const option = document.createElement('option');
            option.textContent = contentType;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading content types:', error);
    }
}

fetchBooks();
async function fetchBooks() {
    try {
        const q = query(booksCollectionRef, where("userId", "==", localStorage.getItem('uid')));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            console.log('No books found for this user.');
            return;
        }
        const sortedDocs = snapshot.docs
            .map(doc => ({ id: doc.id, data: doc.data() }))
            .sort((a, b) => b.data.created_at - a.data.created_at);
        sortedDocs.forEach(({ data, id }) => {
            const card = createCard(data, id);
            card.addEventListener('click', () => {
                showDetail(data, id);
            });
            booksGridContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching books for the user:', error);
    }
}

function createCard(data, id) {
    const image = createElementWithClass('img', 'book-image', {
        src: data.icon,
        alt: data.title,
        width: '100',
        height: '115'
    });
    let status = '';
    if (data.in_review) {
        status = ' ( In Review ) ';
    }
    const imageContainer = createElementWithClass('div', 'image-container', {}, [image]);
    const title = createElementWithClass('h2', 'title', {
        textContent: data.title || 'Title'
    });
    const category = createElementWithClass('h5', 'category', {
        textContent: (data.content_type || 'New') + status
    });
    const bells = createElementWithClass('h5', 'bells', {
        textContent: `🔔 ${data.bells || '0'}`
    });
    const deleteButton = createElementWithClass('button', 'delete-button', {
        textContent: 'Delete'
    });
    const cardElement = createElementWithClass('div', 'card', {}, [imageContainer]);
    const textContainer = createElementWithClass('div', 'text-container', {}, [title, category, bells, deleteButton]);
    cardElement.appendChild(textContainer);
    deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        showDeleteDialog({
            message: 'Are you sure, want to delete this Article ?',
            onDelete: async () => {
                try {
                    await deleteDoc(doc(booksCollectionRef, id));
                    cardElement.remove();
                } catch (error) {
                    console.error('Error deleting book:', error);
                }
            }
        });
    });
    return cardElement;
}

function createElementWithClass(elementType, className, attributes = {}, children = []) {
    const element = document.createElement(elementType);
    element.classList.add(className);
    Object.entries(attributes).forEach(([key, value]) => element[key] = value);
    children.forEach(child => element.appendChild(child));
    return element;
}

function showCustomAlert(message, onClose) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%;background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;z-index: 9999;`;
    const dialog = document.createElement('div');
    dialog.style.cssText = `background: white; padding: 20px; border-radius: 10px; width: 280px;box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); text-align: center;`;
    const msg = document.createElement('p');
    msg.textContent = message;
    msg.style.marginBottom = '20px';
    const okBtn = document.createElement('button');
    okBtn.textContent = 'OK';
    okBtn.style.cssText = `padding: 8px 16px; border: none; border-radius: 6px;background: #007bff; color: white; cursor: pointer;`;
    okBtn.onclick = () => {
        overlay.remove();
        if (onClose) onClose();
    };
    dialog.appendChild(msg);
    dialog.appendChild(okBtn);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
}

function showDeleteDialog({ onDelete, onCancel }) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%;background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;z-index: 9999;`;
    const dialog = document.createElement('div');
    dialog.style.cssText = `background: white; padding: 20px; border-radius: 10px; width: 220px;box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); text-align: center;`;
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `display: flex; justify-content: space-between;`;
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = `flex: 1; margin-right: 10px; padding: 8px 0;border: none; border-radius: 6px; background: #ccc; cursor: pointer;`;
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.cssText = `flex: 1; padding: 8px 0;border: none; border-radius: 6px; background: #ff5c5c; color: white; cursor: pointer;`;
    cancelBtn.onclick = () => {
        overlay.remove();
        onCancel && onCancel();
    };
    deleteBtn.onclick = () => {
        overlay.remove();
        onDelete && onDelete();
    };
    buttonsContainer.appendChild(cancelBtn);
    buttonsContainer.appendChild(deleteBtn);
    dialog.appendChild(buttonsContainer);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
}

function showDetail(data, docId) {
    sessionStorage.setItem('data', JSON.stringify(data));
    let titleForUrl = data.title.replace(/[^\w_]+/g, '-');
    const readerPageUrl = `reader?title=${titleForUrl}&id=${docId}`;
    window.open(readerPageUrl);
}
