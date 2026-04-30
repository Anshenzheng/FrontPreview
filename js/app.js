const defaultCode = {
    html: `<div class="container">
    <h1>Hello, World!</h1>
    <p>这是一个简单的前端代码预览工具演示。</p>
    <button id="clickMe">点击我</button>
    <div id="output"></div>
</div>`,
    css: `.container {
    max-width: 800px;
    margin: 50px auto;
    padding: 2rem;
    text-align: center;
    font-family: 'Segoe UI', sans-serif;
}

h1 {
    color: #7c3aed;
    font-size: 3rem;
    margin-bottom: 1rem;
}

p {
    color: #64748b;
    font-size: 1.25rem;
    margin-bottom: 2rem;
}

button {
    background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4);
}

#output {
    margin-top: 2rem;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 8px;
    color: #475569;
}`,
    js: `document.getElementById('clickMe').addEventListener('click', function() {
    const output = document.getElementById('output');
    const currentTime = new Date().toLocaleTimeString();
    output.innerHTML = \`按钮已点击！当前时间: <strong>\${currentTime}</strong>\`;
    
    output.style.animation = 'none';
    output.offsetHeight;
    output.style.animation = 'pulse 0.5s ease';
});

const style = document.createElement('style');
style.textContent = \`
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
\`;
document.head.appendChild(style);`,
    ts: `// TypeScript 示例代码
interface User {
    name: string;
    age: number;
    email: string;
}

function createUser(name: string, age: number, email: string): User {
    return { name, age, email };
}

function greetUser(user: User): string {
    return \`你好, \${user.name}! 你今年 \${user.age} 岁了。\`;
}

const user: User = createUser('张三', 25, 'zhangsan@example.com');
const greeting: string = greetUser(user);

console.log(greeting);

document.addEventListener('DOMContentLoaded', function() {
    const outputDiv = document.createElement('div');
    outputDiv.style.cssText = \`
        margin-top: 20px;
        padding: 15px;
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        border-radius: 8px;
        border-left: 4px solid #0ea5e9;
    \`;
    outputDiv.innerHTML = \`
        <h3 style="color: #0369a1; margin-bottom: 10px;">TypeScript 执行结果:</h3>
        <p style="color: #1e40af; font-family: monospace;">\${greeting}</p>
        <p style="color: #64748b; font-size: 0.875rem; margin-top: 10px;">
            用户信息: \${JSON.stringify(user)}
        </p>
    \`;
    document.body.appendChild(outputDiv);
});`
};

const tabs = document.querySelectorAll('.tab');
const editorContainers = document.querySelectorAll('.editor-container');
const runBtn = document.getElementById('run-btn');
const clearBtn = document.getElementById('clear-btn');
const formatBtn = document.getElementById('format-btn');
const githubBtn = document.getElementById('github-btn');
const previewIframe = document.getElementById('preview-iframe');
const emptyState = document.getElementById('empty-state');
const previewIndicator = document.getElementById('preview-indicator');
const previewStatus = document.getElementById('preview-status');
const errorContainer = document.getElementById('error-container');
const errorMessage = document.getElementById('error-message');
const successIndicator = document.getElementById('success-indicator');
const cursorPosition = document.getElementById('cursor-position');

const githubModal = document.getElementById('github-modal');
const modalCloseBtn = document.getElementById('modal-close');
const modalCancelBtn = document.getElementById('modal-cancel');
const modalConfirmBtn = document.getElementById('modal-confirm');
const repoInput = document.getElementById('github-repo');
const tokenInput = document.getElementById('github-token');
const directoryInput = document.getElementById('github-directory');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

let editors = {};
let currentTab = 'html';

function initEditors() {
    const commonOptions = {
        theme: 'monokai',
        lineNumbers: true,
        lineWrapping: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
        autoCloseBrackets: true,
        matchBrackets: true,
        spellcheck: false,
        autocorrect: false,
        autocapitalize: false,
        viewportMargin: 10,
        lineWrapping: false,
        viewportMargin: Infinity,
        extraKeys: {
            'Ctrl-/': 'toggleComment',
            'Cmd-/': 'toggleComment',
            'Tab': function(cm) {
                cm.replaceSelection('    ');
            }
        }
    };

    editors.html = CodeMirror.fromTextArea(
        document.getElementById('html-editor'),
        {
            ...commonOptions,
            mode: 'htmlmixed',
            value: defaultCode.html
        }
    );

    editors.css = CodeMirror.fromTextArea(
        document.getElementById('css-editor'),
        {
            ...commonOptions,
            mode: 'css',
            value: defaultCode.css
        }
    );

    editors.js = CodeMirror.fromTextArea(
        document.getElementById('js-editor'),
        {
            ...commonOptions,
            mode: 'javascript',
            value: defaultCode.js
        }
    );

    editors.ts = CodeMirror.fromTextArea(
        document.getElementById('ts-editor'),
        {
            ...commonOptions,
            mode: 'javascript',
            value: defaultCode.ts
        }
    );

    Object.keys(editors).forEach(key => {
        editors[key].on('cursorActivity', function(cm) {
            const cursor = cm.getCursor();
            cursorPosition.textContent = `行 ${cursor.line + 1}, 列 ${cursor.ch + 1}`;
        });

        editors[key].on('change', function() {
            hideError();
        });
    });

    setTimeout(() => {
        Object.values(editors).forEach(editor => {
            editor.refresh();
        });
    }, 100);
}

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        currentTab = targetTab;

        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        editorContainers.forEach(container => container.classList.remove('active'));
        document.getElementById(`${targetTab}-container`).classList.add('active');

        if (editors[targetTab]) {
            editors[targetTab].refresh();

            const cursor = editors[targetTab].getCursor();
            cursorPosition.textContent = `行 ${cursor.line + 1}, 列 ${cursor.ch + 1}`;
        }

        setTimeout(() => {
            if (editors[currentTab]) {
                editors[currentTab].refresh();
            }
        }, 1);

        requestAnimationFrame(() => {
            if (editors[currentTab]) {
                editors[currentTab].refresh();
            }
        });
    });
});

function compileTypeScript(tsCode) {
    try {
        const result = ts.transpileModule(tsCode, {
            compilerOptions: {
                module: ts.ModuleKind.ESNext,
                target: ts.ScriptTarget.ESNext,
                strict: false,
                esModuleInterop: true,
                skipLibCheck: true
            }
        });
        return {
            success: true,
            jsCode: result.outputText,
            error: null
        };
    } catch (error) {
        return {
            success: false,
            jsCode: null,
            error: error.message
        };
    }
}

function isJson(code) {
    try {
        const trimmed = code.trim();
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
            JSON.parse(trimmed);
            return true;
        }
    } catch (e) {
    }
    return false;
}

function formatJson(code) {
    try {
        const parsed = JSON.parse(code.trim());
        return JSON.stringify(parsed, null, 4);
    } catch (e) {
        return code;
    }
}

function formatCode(code, type) {
    if (!code || !code.trim()) return code;

    if (isJson(code)) {
        return formatJson(code);
    }

    if (type === 'css') {
        return formatCSS(code);
    } else if (type === 'html') {
        return formatHTML(code);
    } else {
        return formatJavaScript(code);
    }
}

function formatCSS(code) {
    let formatted = code;
    
    formatted = formatted.replace(/\s+/g, ' ');
    formatted = formatted.replace(/\s*\{/g, ' {');
    formatted = formatted.replace(/\}\s*/g, '}\n');
    formatted = formatted.replace(/;\s*/g, ';\n');
    
    let indentLevel = 0;
    const lines = formatted.split('\n');
    const result = [];

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        if (line === '}') {
            indentLevel = Math.max(0, indentLevel - 1);
        }

        if (line.includes('}') && !line.includes('{')) {
            indentLevel = Math.max(0, indentLevel - (line.match(/\}/g) || []).length);
        }

        result.push('    '.repeat(indentLevel) + line);

        if (line.endsWith('{')) {
            indentLevel++;
        }

        if (line.includes('{') && !line.includes('}')) {
            indentLevel += (line.match(/\{/g) || []).length - (line.endsWith('{') ? 1 : 0);
        }
    }

    return result.join('\n');
}

function formatHTML(code) {
    let formatted = code;
    
    formatted = formatted.replace(/></g, '>\n<');
    
    let indentLevel = 0;
    const lines = formatted.split('\n');
    const result = [];
    const selfClosingTags = ['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr'];

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        const closingTagMatch = line.match(/^<\/(\w+)/);
        if (closingTagMatch) {
            indentLevel = Math.max(0, indentLevel - 1);
        }

        const isSelfClosing = selfClosingTags.some(tag => new RegExp(`^<${tag}[\\s>]`, 'i').test(line)) || 
                               line.includes('/>');
        
        const hasBothTags = /<\w+[^>]*>.*<\/\w+>/.test(line);

        if (!isSelfClosing && !hasBothTags) {
            const openingTagMatch = line.match(/^<(\w+)/);
            if (openingTagMatch && !closingTagMatch) {
                result.push('    '.repeat(indentLevel) + line);
                indentLevel++;
                continue;
            }
        }

        result.push('    '.repeat(indentLevel) + line);
    }

    return result.join('\n');
}

function formatJavaScript(code) {
    let formatted = code;
    
    if (isJsonLikeObject(formatted)) {
        const jsonFormatted = tryFormatAsJson(formatted);
        if (jsonFormatted) return jsonFormatted;
    }

    formatted = formatted
        .replace(/\s*\{/g, ' {')
        .replace(/\}\s*/g, '}\n');

    formatted = formatted.replace(/;\s*/g, ';\n');

    formatted = formatted.replace(/,\s*/g, ', ');

    formatted = formatted.replace(/\n\s*\n\s*\n/g, '\n\n');

    let indentLevel = 0;
    const lines = formatted.split('\n');
    const result = [];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) continue;

        const closeBraces = (line.match(/^[\}\]\)]+/) || [''])[0].length;
        if (closeBraces > 0) {
            indentLevel = Math.max(0, indentLevel - closeBraces);
        }

        if (line === '}' || line === ']' || line === ')') {
            result.push('    '.repeat(indentLevel) + line);
            continue;
        }

        result.push('    '.repeat(indentLevel) + line);

        const openBraces = (line.match(/[\{\[\(]/g) || []).length;
        const closeBracesInLine = (line.match(/[\}\]\)]/g) || []).length - closeBraces;
        
        indentLevel += openBraces - closeBracesInLine;
        indentLevel = Math.max(0, indentLevel);
    }

    return result.join('\n');
}

function isJsonLikeObject(code) {
    const trimmed = code.trim();
    return (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
           (trimmed.startsWith('[') && trimmed.endsWith(']'));
}

function tryFormatAsJson(code) {
    try {
        let jsonStr = code.trim();
        
        jsonStr = jsonStr.replace(/,\s*([\}\]])/g, '$1');
        
        const parsed = eval('(' + jsonStr + ')');
        return JSON.stringify(parsed, null, 4);
    } catch (e) {
        return null;
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorContainer.classList.add('show');
}

function hideError() {
    errorContainer.classList.remove('show');
}

function showSuccess(message) {
    const indicator = successIndicator;
    indicator.querySelector('span:last-child').textContent = message || '预览已更新';
    indicator.classList.add('show');
    setTimeout(() => {
        indicator.classList.remove('show');
    }, 2000);
}

function generateFullHtml() {
    const htmlCode = editors.html ? editors.html.getValue().trim() : '';
    const cssCode = editors.css ? editors.css.getValue().trim() : '';
    const jsCode = editors.js ? editors.js.getValue().trim() : '';
    const tsCode = editors.ts ? editors.ts.getValue().trim() : '';

    let allJsCode = '';

    if (jsCode) {
        allJsCode += jsCode + '\n';
    }

    if (tsCode) {
        const compileResult = compileTypeScript(tsCode);
        if (compileResult.success) {
            allJsCode += compileResult.jsCode + '\n';
        } else {
            showError('TypeScript 编译错误: ' + compileResult.error);
            return null;
        }
    }

    let fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>预览结果</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f8fafc;
            min-height: 100vh;
            padding: 20px;
        }
        ${cssCode}
    </style>
</head>
<body>
    ${htmlCode}
    <script>
        ${allJsCode}
    <\/script>
</body>
</html>`;

    return fullHtml;
}

function runPreview() {
    hideError();

    const fullHtml = generateFullHtml();
    if (!fullHtml) return;

    emptyState.style.display = 'none';
    previewIframe.style.display = 'block';

    previewIndicator.classList.add('active');
    previewStatus.textContent = '预览已更新';

    previewIframe.srcdoc = fullHtml;

    showSuccess('预览已更新');
}

function formatCurrentEditor() {
    const editor = editors[currentTab];
    if (!editor) {
        showError('编辑器未初始化，请刷新页面重试');
        return;
    }
    const code = editor.getValue();
    const formatted = formatCode(code, currentTab);
    
    editor.setValue(formatted);
    showSuccess('代码已格式化');
}

function clearEditors() {
    if (confirm('确定要清空所有代码吗？')) {
        Object.keys(editors).forEach(key => {
            if (editors[key]) {
                editors[key].setValue('');
            }
        });

        emptyState.style.display = 'block';
        previewIframe.style.display = 'none';
        previewIndicator.classList.remove('active');
        previewStatus.textContent = '等待预览...';
        hideError();
    }
}

function openGithubModal() {
    repoInput.value = '';
    tokenInput.value = '';
    const timestamp = new Date().toISOString().slice(0, 10);
    directoryInput.value = `code-preview-${timestamp}`;
    progressContainer.classList.remove('show');
    progressBar.style.width = '0%';
    progressText.textContent = '';
    modalConfirmBtn.disabled = false;
    githubModal.classList.add('show');
}

function closeGithubModal() {
    githubModal.classList.remove('show');
}

function parseRepoUrl(url) {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/\.\s]+)/);
    if (match) {
        return {
            owner: match[1],
            repo: match[2]
        };
    }
    return null;
}

const CORS_PROXIES = [
    (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
];

function extractImageUrls(html, css) {
    const urls = new Set();
    
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
        const url = match[1];
        if (!url.startsWith('data:') && !url.startsWith('blob:') && url.trim()) {
            urls.add(url);
        }
    }
    
    const cssUrlRegex = /url\(["']?([^"')]+)["']?\)/gi;
    while ((match = cssUrlRegex.exec(css)) !== null) {
        const url = match[1];
        if (!url.startsWith('data:') && !url.startsWith('blob:') && url.trim()) {
            urls.add(url);
        }
    }
    
    return Array.from(urls);
}

async function loadImageWithCors(url, useProxy = true) {
    return new Promise((resolve) => {
        if (url.startsWith('data:') || url.startsWith('blob:')) {
            resolve({ success: true, url: url, isDataUrl: true });
            return;
        }
        
        const tryLoad = (targetUrl, attempt) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth || img.width || 100;
                    canvas.height = img.naturalHeight || img.height || 100;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    const dataUrl = canvas.toDataURL('image/png');
                    resolve({ 
                        success: true, 
                        url: dataUrl, 
                        originalUrl: url,
                        isDataUrl: true 
                    });
                } catch (e) {
                    if (useProxy && attempt < CORS_PROXIES.length) {
                        const proxyUrl = CORS_PROXIES[attempt](url);
                        console.log(`尝试代理 ${attempt + 1}/${CORS_PROXIES.length}: ${proxyUrl.substring(0, 50)}...`);
                        tryLoad(proxyUrl, attempt + 1);
                    } else {
                        resolve({ 
                            success: false, 
                            url: url, 
                            error: e.message 
                        });
                    }
                }
            };
            
            img.onerror = () => {
                if (useProxy && attempt < CORS_PROXIES.length) {
                    const proxyUrl = CORS_PROXIES[attempt](url);
                    console.log(`图片加载失败，尝试代理 ${attempt + 1}/${CORS_PROXIES.length}`);
                    tryLoad(proxyUrl, attempt + 1);
                } else {
                    resolve({ 
                        success: false, 
                        url: url, 
                        error: '图片加载失败' 
                    });
                }
            };
            
            img.src = targetUrl;
        };
        
        tryLoad(url, 0);
    });
}

async function preloadAndConvertImages(html, css) {
    const imageUrls = extractImageUrls(html, css);
    console.log(`发现 ${imageUrls.length} 个图片需要处理`);
    
    const results = [];
    const urlMap = {};
    
    for (const url of imageUrls) {
        console.log(`处理图片: ${url.substring(0, 60)}...`);
        const result = await loadImageWithCors(url);
        results.push(result);
        if (result.success && result.isDataUrl) {
            urlMap[url] = result.url;
        }
    }
    
    let processedHtml = html;
    let processedCss = css;
    
    for (const [originalUrl, dataUrl] of Object.entries(urlMap)) {
        const escapedUrl = originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        const imgRegex = new RegExp(`(<img[^>]+src=["'])${escapedUrl}(["'])`, 'gi');
        processedHtml = processedHtml.replace(imgRegex, `$1${dataUrl}$2`);
        
        const cssRegex = new RegExp(`(url\\(["']?)${escapedUrl}(["']?\\))`, 'gi');
        processedCss = processedCss.replace(cssRegex, `$1${dataUrl}$2`);
    }
    
    const failedImages = results.filter(r => !r.success);
    
    return {
        html: processedHtml,
        css: processedCss,
        urlMap,
        failedImages,
        totalImages: imageUrls.length,
        successCount: results.filter(r => r.success).length
    };
}

function createImagePlaceholder(url, index) {
    const shortUrl = url.length > 40 ? url.substring(0, 40) + '...' : url;
    return `
        <div style="
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 200px;
            height: 150px;
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: 2px dashed #f59e0b;
            border-radius: 12px;
            margin: 8px;
            padding: 12px;
            font-family: 'Segoe UI', sans-serif;
        ">
            <svg width="48" height="48" fill="none" stroke="#f59e0b" stroke-width="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <path d="M21 15l-5-5L5 21"></path>
            </svg>
            <div style="
                font-size: 12px;
                color: #92400e;
                margin-top: 8px;
                text-align: center;
                word-break: break-all;
            ">
                <strong>图片 #${index}</strong><br>
                ${shortUrl}
            </div>
            <div style="
                font-size: 10px;
                color: #b45309;
                margin-top: 4px;
            ">
                (跨域图片 - 无法直接加载)
            </div>
        </div>
    `;
}

async function capturePreviewScreenshot() {
    return new Promise(async (resolve) => {
        try {
            let htmlCode = editors.html ? editors.html.getValue().trim() : '';
            let cssCode = editors.css ? editors.css.getValue().trim() : '';
            const jsCode = editors.js ? editors.js.getValue().trim() : '';
            const tsCode = editors.ts ? editors.ts.getValue().trim() : '';

            if (!htmlCode && !cssCode && !jsCode && !tsCode) {
                resolve({
                    success: false,
                    error: '没有可截图的内容，请先编写代码'
                });
                return;
            }

            console.log('开始预处理图片...');
            const imageResult = await preloadAndConvertImages(htmlCode, cssCode);
            htmlCode = imageResult.html;
            cssCode = imageResult.css;
            
            console.log(`图片处理完成: ${imageResult.successCount}/${imageResult.totalImages} 成功`);
            
            if (imageResult.failedImages.length > 0) {
                console.log(`有 ${imageResult.failedImages.length} 个图片加载失败，将使用占位符`);
            }

            let allJsCode = '';
            if (jsCode) {
                allJsCode += jsCode + '\n';
            }
            if (tsCode) {
                const compileResult = compileTypeScript(tsCode);
                if (compileResult.success) {
                    allJsCode += compileResult.jsCode + '\n';
                }
            }

            const screenshotIframe = document.createElement('iframe');
            screenshotIframe.id = 'screenshot-iframe';
            screenshotIframe.style.cssText = `
                position: fixed;
                left: -9999px;
                top: 0;
                width: 1200px;
                height: 900px;
                border: none;
                z-index: 999999;
            `;

            document.body.appendChild(screenshotIframe);

            const iframeDoc = screenshotIframe.contentDocument || screenshotIframe.contentWindow.document;

            const failedImagesPlaceholder = imageResult.failedImages.length > 0 
                ? `
                    <div style="
                        background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
                        border-left: 4px solid #f59e0b;
                        padding: 16px;
                        margin-bottom: 20px;
                        border-radius: 0 8px 8px 0;
                        font-family: 'Segoe UI', sans-serif;
                    ">
                        <div style="
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            margin-bottom: 12px;
                        ">
                            <svg width="20" height="20" fill="none" stroke="#f59e0b" stroke-width="2" viewBox="0 0 24 24">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                            <span style="font-weight: 600; color: #92400e; font-size: 14px;">
                                以下 ${imageResult.failedImages.length} 个图片由于跨域限制无法直接加载：
                            </span>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            ${imageResult.failedImages.map((img, i) => createImagePlaceholder(img.url, i + 1)).join('')}
                        </div>
                        <div style="
                            margin-top: 12px;
                            font-size: 12px;
                            color: #b45309;
                        ">
                            💡 提示：如需完整加载跨域图片，请确保图片服务器支持 CORS，或使用 Data URL 格式的图片。
                        </div>
                    </div>
                ` 
                : '';

            const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>截图预览</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #ffffff;
            min-height: 100vh;
            padding: 20px;
        }
        ${cssCode}
    </style>
</head>
<body>
    ${failedImagesPlaceholder}
    ${htmlCode || '<div style="padding: 40px; text-align: center; color: #666;">暂无 HTML 内容</div>'}
    
    <script>
        ${allJsCode}
        
        function waitForImages() {
            return new Promise((resolve) => {
                const images = document.querySelectorAll('img');
                if (images.length === 0) {
                    resolve();
                    return;
                }
                
                let loadedCount = 0;
                const totalImages = images.length;
                
                images.forEach((img) => {
                    if (img.complete) {
                        loadedCount++;
                        if (loadedCount === totalImages) {
                            resolve();
                        }
                    } else {
                        img.addEventListener('load', () => {
                            loadedCount++;
                            if (loadedCount === totalImages) {
                                resolve();
                            }
                        });
                        img.addEventListener('error', () => {
                            loadedCount++;
                            if (loadedCount === totalImages) {
                                resolve();
                            }
                        });
                    }
                });
                
                setTimeout(resolve, 10000);
            });
        }
        
        async function captureAndSend() {
            await waitForImages();
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            try {
                const canvas = await html2canvas(document.body, {
                    backgroundColor: '#ffffff',
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    logging: false,
                    imageTimeout: 20000,
                    removeContainer: true,
                    ignoreElements: (element) => {
                        return false;
                    }
                });
                
                const dataUrl = canvas.toDataURL('image/png');
                
                window.parent.postMessage({
                    type: 'screenshot-complete',
                    success: true,
                    dataUrl: dataUrl,
                    imageStats: {
                        total: ${imageResult.totalImages},
                        success: ${imageResult.successCount},
                        failed: ${imageResult.failedImages.length}
                    }
                }, '*');
            } catch (error) {
                window.parent.postMessage({
                    type: 'screenshot-complete',
                    success: false,
                    error: error.message
                }, '*');
            }
        }
        
        if (document.readyState === 'complete') {
            captureAndSend();
        } else {
            window.addEventListener('load', captureAndSend);
        }
    <\/script>
</body>
</html>`;

            iframeDoc.open();
            iframeDoc.write(fullHtml);
            iframeDoc.close();

            let messageReceived = false;
            let timeoutId = null;

            const messageHandler = (event) => {
                if (event.data && event.data.type === 'screenshot-complete') {
                    messageReceived = true;
                    window.removeEventListener('message', messageHandler);
                    
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }

                    try {
                        if (document.body.contains(screenshotIframe)) {
                            document.body.removeChild(screenshotIframe);
                        }
                    } catch (e) {}

                    if (event.data.success) {
                        const base64 = event.data.dataUrl.split(',')[1];
                        resolve({
                            success: true,
                            base64: base64,
                            dataUrl: event.data.dataUrl
                        });
                    } else {
                        console.error('iframe 内截图失败:', event.data.error);
                        createFallbackScreenshot(resolve, htmlCode, cssCode, jsCode, tsCode);
                    }
                }
            };

            window.addEventListener('message', messageHandler);

            timeoutId = setTimeout(() => {
                if (!messageReceived) {
                    console.warn('截图超时，使用备用方案');
                    window.removeEventListener('message', messageHandler);
                    
                    try {
                        if (document.body.contains(screenshotIframe)) {
                            document.body.removeChild(screenshotIframe);
                        }
                    } catch (e) {}
                    
                    createFallbackScreenshot(resolve, htmlCode, cssCode, jsCode, tsCode);
                }
            }, 15000);

        } catch (error) {
            console.error('截图失败:', error);
            const htmlCode = editors.html ? editors.html.getValue().trim() : '';
            const cssCode = editors.css ? editors.css.getValue().trim() : '';
            const jsCode = editors.js ? editors.js.getValue().trim() : '';
            const tsCode = editors.ts ? editors.ts.getValue().trim() : '';
            createFallbackScreenshot(resolve, htmlCode, cssCode, jsCode, tsCode);
        }
    });
}

function createFallbackScreenshot(resolve, htmlCode, cssCode, jsCode, tsCode) {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const maxWidth = 1200;
        const baseHeight = 200;
        const lineHeight = 20;
        const padding = 40;
        
        let contentHeight = 0;
        
        if (htmlCode) {
            const lines = htmlCode.split('\n').slice(0, 15);
            contentHeight += 50 + lines.length * lineHeight;
        }
        
        if (cssCode) {
            const lines = cssCode.split('\n').slice(0, 8);
            contentHeight += 50 + lines.length * lineHeight;
        }
        
        if (jsCode || tsCode) {
            const lines = (jsCode || tsCode).split('\n').slice(0, 8);
            contentHeight += 50 + lines.length * lineHeight;
        }
        
        const canvasHeight = Math.max(baseHeight + contentHeight, 600);
        
        canvas.width = maxWidth;
        canvas.height = canvasHeight;
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, canvas.width, 80);
        
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 28px "Segoe UI", sans-serif';
        ctx.fillText('📸 代码预览截图', padding, 50);
        
        ctx.fillStyle = '#64748b';
        ctx.font = '14px "Segoe UI", sans-serif';
        ctx.fillText('生成时间: ' + new Date().toLocaleString(), padding, 75);
        
        let y = 100;
        
        if (htmlCode) {
            y = drawCodeSection(ctx, '📄 HTML 代码', htmlCode, '#7c3aed', padding, y, maxWidth - padding * 2, 15);
            y += 20;
        }
        
        if (cssCode) {
            y = drawCodeSection(ctx, '🎨 CSS 代码', cssCode, '#ec4899', padding, y, maxWidth - padding * 2, 8);
            y += 20;
        }
        
        if (jsCode || tsCode) {
            y = drawCodeSection(ctx, '⚡ JavaScript/TypeScript 代码', jsCode || tsCode, '#0ea5e9', padding, y, maxWidth - padding * 2, 8);
        }
        
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '13px "Segoe UI", sans-serif';
        ctx.fillText('💡 提示：此为代码摘要截图。如需包含动态效果（弹窗、动画等）的完整截图，请确保 JavaScript 代码在页面加载时自动执行。', padding, canvas.height - 35);
        
        const dataUrl = canvas.toDataURL('image/png');
        const base64 = dataUrl.split(',')[1];
        
        resolve({
            success: true,
            base64: base64,
            dataUrl: dataUrl
        });
    } catch (fallbackError) {
        console.error('备用截图方案也失败:', fallbackError);
        resolve({
            success: false,
            error: fallbackError.message
        });
    }
}

function drawCodeSection(ctx, title, code, color, x, y, maxWidth, maxLines) {
    const padding = 15;
    const lineHeight = 18;
    const lines = code.split('\n').slice(0, maxLines);
    const hasMore = code.split('\n').length > maxLines;
    
    const sectionHeight = 40 + lines.length * lineHeight + (hasMore ? 25 : 0);
    
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    roundRect(ctx, x, y, maxWidth, sectionHeight, 8);
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = color;
    ctx.font = 'bold 16px "Segoe UI", sans-serif';
    ctx.fillText(title, x + padding, y + 28);
    
    ctx.fillStyle = '#374151';
    ctx.font = '13px "Consolas", "Monaco", monospace';
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const displayLine = line.length > 100 ? line.substring(0, 100) + '...' : line;
        ctx.fillText(displayLine, x + padding, y + 50 + i * lineHeight);
    }
    
    if (hasMore) {
        ctx.fillStyle = '#9ca3af';
        ctx.font = '12px "Segoe UI", sans-serif';
        ctx.fillText(`... 还有 ${code.split('\n').length - maxLines} 行代码已省略`, x + padding, y + sectionHeight - 15);
    }
    
    return y + sectionHeight;
}

function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

async function getRepoInfo(owner, repo, token) {
    const url = `https://api.github.com/repos/${owner}/${repo}`;
    const headers = {
        'Accept': 'application/vnd.github.v3+json'
    };
    if (token) {
        headers['Authorization'] = `token ${token}`;
    }

    const response = await fetch(url, { headers });
    if (!response.ok) {
        throw new Error(`无法访问仓库: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

async function getFileSha(owner, repo, path, token, branch = 'main') {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    const headers = {
        'Accept': 'application/vnd.github.v3+json'
    };
    if (token) {
        headers['Authorization'] = `token ${token}`;
    }

    const response = await fetch(url, { headers });
    if (response.status === 404) {
        return null;
    }
    if (!response.ok) {
        throw new Error(`获取文件信息失败: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.sha;
}

async function createFile(owner, repo, path, content, message, token, branch = 'main') {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const existingSha = await getFileSha(owner, repo, path, token, branch);

    const body = {
        message: message,
        content: btoa(unescape(encodeURIComponent(content))),
        branch: branch
    };

    if (existingSha) {
        body.sha = existingSha;
    }

    const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `token ${token}`;
    }

    const response = await fetch(url, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`创建文件失败: ${response.status} ${response.statusText} - ${errorData.message || ''}`);
    }

    return response.json();
}

async function createImageFile(owner, repo, path, base64Content, message, token, branch = 'main') {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const existingSha = await getFileSha(owner, repo, path, token, branch);

    const body = {
        message: message,
        content: base64Content,
        branch: branch
    };

    if (existingSha) {
        body.sha = existingSha;
    }

    const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `token ${token}`;
    }

    const response = await fetch(url, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`创建图片文件失败: ${response.status} ${response.statusText} - ${errorData.message || ''}`);
    }

    return response.json();
}

async function saveToGithub() {
    const repoUrl = repoInput.value.trim();
    const token = tokenInput.value.trim();
    const directory = directoryInput.value.trim();

    if (!repoUrl) {
        showError('请输入 GitHub 仓库地址');
        return;
    }

    if (!directory) {
        showError('请输入目录名称');
        return;
    }

    const repoInfo = parseRepoUrl(repoUrl);
    if (!repoInfo) {
        showError('无法解析仓库地址，请输入有效的 GitHub 仓库 URL');
        return;
    }

    modalConfirmBtn.disabled = true;
    progressContainer.classList.add('show');
    progressBar.style.width = '10%';
    progressText.textContent = '正在验证仓库...';

    try {
        await getRepoInfo(repoInfo.owner, repoInfo.repo, token);

        progressBar.style.width = '30%';
        progressText.textContent = '正在准备代码文件...';

        const htmlCode = editors.html ? editors.html.getValue().trim() : '';
        const cssCode = editors.css ? editors.css.getValue().trim() : '';
        const jsCode = editors.js ? editors.js.getValue().trim() : '';
        const tsCode = editors.ts ? editors.ts.getValue().trim() : '';

        const timestamp = new Date().toISOString();
        const commitMessage = `添加代码预览文件 - ${timestamp}`;

        const files = [];

        if (htmlCode) {
            files.push({
                path: `${directory}/index.html`,
                content: htmlCode,
                name: 'index.html'
            });
        }

        if (cssCode) {
            files.push({
                path: `${directory}/style.css`,
                content: cssCode,
                name: 'style.css'
            });
        }

        if (jsCode) {
            files.push({
                path: `${directory}/script.js`,
                content: jsCode,
                name: 'script.js'
            });
        }

        if (tsCode) {
            files.push({
                path: `${directory}/script.ts`,
                content: tsCode,
                name: 'script.ts'
            });
        }

        if (htmlCode && cssCode) {
            let fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>代码预览</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    ${htmlCode}
    <script src="script.js"></script>
</body>
</html>`;
            files.push({
                path: `${directory}/full.html`,
                content: fullHtml,
                name: 'full.html'
            });
        }

        const totalFiles = files.length + 1;
        let completedFiles = 0;

        for (const file of files) {
            progressText.textContent = `正在上传: ${file.name}`;
            await createFile(
                repoInfo.owner,
                repoInfo.repo,
                file.path,
                file.content,
                `${commitMessage} - ${file.name}`,
                token
            );
            completedFiles++;
            progressBar.style.width = `${30 + (completedFiles / totalFiles) * 60}%`;
        }

        progressText.textContent = '正在生成预览截图...';
        const screenshotResult = await capturePreviewScreenshot();
        
        if (screenshotResult.success) {
            progressText.textContent = '正在上传截图...';
            await createImageFile(
                repoInfo.owner,
                repoInfo.repo,
                `${directory}/preview.png`,
                screenshotResult.base64,
                `${commitMessage} - 预览截图`,
                token
            );
        }

        progressBar.style.width = '100%';
        progressText.textContent = '上传完成！';

        setTimeout(() => {
            closeGithubModal();
            showSuccess('代码已成功保存到 GitHub！');
        }, 1000);

    } catch (error) {
        showError(error.message);
        modalConfirmBtn.disabled = false;
        progressContainer.classList.remove('show');
    }
}

runBtn.addEventListener('click', runPreview);
clearBtn.addEventListener('click', clearEditors);
formatBtn.addEventListener('click', formatCurrentEditor);
githubBtn.addEventListener('click', openGithubModal);
modalCloseBtn.addEventListener('click', closeGithubModal);
modalCancelBtn.addEventListener('click', closeGithubModal);
modalConfirmBtn.addEventListener('click', saveToGithub);

githubModal.addEventListener('click', (e) => {
    if (e.target === githubModal) {
        closeGithubModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && githubModal.classList.contains('show')) {
        closeGithubModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        runPreview();
    }
});

initEditors();