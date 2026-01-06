const input = document.getElementById('urlInput');
const result = document.getElementById('result');
//considering this to be the urls database to check if the url exists.
const urlsDB = ['https://github.com/rakshithsherlocked/Netflix-gpt/tree/main/.firebase/', 'https://github.com/rakshithsherlocked/Netflix-gpt/blob/main/package.json', 'https://google.com/']; // Mock database of URLs
//extra check on the different file types.
const fileExtensions = ['txt', 'jpg', 'png', 'pdf', 'docx', 'xlsx', 'zip', 'json'];


function validateURL(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

function mockAPICall(url) {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (urlsDB.includes(url)) {
                const checkURL = new URL(url);
                const pathname = checkURL.pathname;
                const segments = pathname.split('/');
                const filename = segments[segments.length - 1];
                const extension = filename.split('.').pop();
                if (fileExtensions.includes(extension)) {
                    resolve({ exists: true, type: "file" })
                } else if (pathname.endsWith('/')) {
                    resolve({ exists: true, type: "folder" })
                } else {
                    resolve({ exists: false });
                }
            } else {
                resolve({ exists: false });
            }
        }, 800);
    })
}

function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    }
}

function setResult(message, className) {
    result.textContent = message;
    result.className = `result ${className || ''}`;
}

const debouncedCheckURL = debounce(async (url) => {
    if (url !== newUrl) return;
    const response = await mockAPICall(url);
    if (url !== newUrl) return;
    if (response.exists) {
        if (response.type === "folder") {
            setResult('The URL points to a valid folder.', 'success');
        } else if (response.type === "file") {
            setResult('The URL points to a valid file.', 'success');
        }
    } else {
        setResult('The URL does not exist.', 'error');
    }
}, 500);

let newUrl = ""

input.addEventListener('input', (e) => {
    const url = e.target.value.trim();
    newUrl = url
    if (!url) {
        setResult('');
        return;
    }
    if (!validateURL(url)) {
        setResult('Invalid URL format.', 'error');
        return;
    }
    setResult('Checking URL...', 'loading');
    debouncedCheckURL(url);
})
