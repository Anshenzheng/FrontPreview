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

async function capturePreviewScreenshot() {
    return new Promise(async (resolve) => {
        try {
            const htmlCode = editors.html ? editors.html.getValue().trim() : '';
            const cssCode = editors.css ? editors.css.getValue().trim() : '';
            const jsCode = editors.js ? editors.js.getValue().trim() : '';
            const tsCode = editors.ts ? editors.ts.getValue().trim() : '';

            if (!htmlCode && !cssCode && !jsCode && !tsCode) {
                resolve({
                    success: false,
                    error: '没有可截图的内容，请先编写代码'
                });
                return;
            }

            const screenshotContainer = document.createElement('div');
            screenshotContainer.id = 'screenshot-container';
            screenshotContainer.style.cssText = `
                position: fixed;
                left: -9999px;
                top: 0;
                width: 1200px;
                min-height: 800px;
                background: #ffffff;
                padding: 20px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                z-index: 999999;
                overflow: visible;
            `;

            if (cssCode) {
                const styleElement = document.createElement('style');
                styleElement.textContent = `
                    #screenshot-container * {
                        box-sizing: border-box;
                    }
                    ${cssCode}
                `;
                screenshotContainer.appendChild(styleElement);
            }

            const contentWrapper = document.createElement('div');
            contentWrapper.id = 'screenshot-content';
            contentWrapper.innerHTML = htmlCode || '<div style="padding: 40px; text-align: center; color: #666;">暂无 HTML 内容</div>';
            screenshotContainer.appendChild(contentWrapper);

            document.body.appendChild(screenshotContainer);

            await new Promise(resolve => setTimeout(resolve, 200));

            const canvas = await html2canvas(screenshotContainer, {
                backgroundColor: '#ffffff',
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false
            });

            document.body.removeChild(screenshotContainer);

            const dataUrl = canvas.toDataURL('image/png');
            const base64 = dataUrl.split(',')[1];

            resolve({
                success: true,
                base64: base64,
                dataUrl: dataUrl
            });

        } catch (error) {
            console.error('截图失败:', error);
            
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = 800;
                canvas.height = 600;
                
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = '#f8fafc';
                ctx.fillRect(0, 0, canvas.width, 60);
                
                ctx.fillStyle = '#475569';
                ctx.font = 'bold 20px sans-serif';
                ctx.fillText('代码预览', 30, 40);
                
                ctx.fillStyle = '#64748b';
                ctx.font = '12px sans-serif';
                ctx.fillText('截图时间: ' + new Date().toLocaleString(), 30, 80);
                
                const htmlCode = editors.html ? editors.html.getValue().trim() : '';
                const cssCode = editors.css ? editors.css.getValue().trim() : '';
                const jsCode = editors.js ? editors.js.getValue().trim() : '';
                const tsCode = editors.ts ? editors.ts.getValue().trim() : '';
                
                let y = 120;
                ctx.font = '14px monospace';
                
                if (htmlCode) {
                    ctx.fillStyle = '#7c3aed';
                    ctx.font = 'bold 14px sans-serif';
                    ctx.fillText('📄 HTML 代码:', 30, y);
                    y += 25;
                    
                    ctx.fillStyle = '#374151';
                    ctx.font = '12px monospace';
                    const htmlLines = htmlCode.split('\n').slice(0, 10);
                    for (const line of htmlLines) {
                        if (y > 550) {
                            ctx.fillStyle = '#9ca3af';
                            ctx.fillText('... (更多内容已省略)', 30, y);
                            break;
                        }
                        ctx.fillText(line.substring(0, 80), 50, y);
                        y += 20;
                    }
                    y += 10;
                }
                
                if (cssCode) {
                    ctx.fillStyle = '#ec4899';
                    ctx.font = 'bold 14px sans-serif';
                    ctx.fillText('🎨 CSS 代码:', 30, y);
                    y += 25;
                    
                    ctx.fillStyle = '#374151';
                    ctx.font = '12px monospace';
                    const cssLines = cssCode.split('\n').slice(0, 5);
                    for (const line of cssLines) {
                        if (y > 550) {
                            ctx.fillStyle = '#9ca3af';
                            ctx.fillText('... (更多内容已省略)', 30, y);
                            break;
                        }
                        ctx.fillText(line.substring(0, 80), 50, y);
                        y += 20;
                    }
                    y += 10;
                }
                
                if (jsCode || tsCode) {
                    ctx.fillStyle = '#0ea5e9';
                    ctx.font = 'bold 14px sans-serif';
                    ctx.fillText('⚡ JavaScript/TypeScript 代码:', 30, y);
                    y += 25;
                    
                    ctx.fillStyle = '#374151';
                    ctx.font = '12px monospace';
                    const codeLines = (jsCode || tsCode).split('\n').slice(0, 5);
                    for (const line of codeLines) {
                        if (y > 550) {
                            ctx.fillStyle = '#9ca3af';
                            ctx.fillText('... (更多内容已省略)', 30, y);
                            break;
                        }
                        ctx.fillText(line.substring(0, 80), 50, y);
                        y += 20;
                    }
                }
                
                ctx.fillStyle = '#e2e8f0';
                ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
                ctx.fillStyle = '#94a3b8';
                ctx.font = '11px sans-serif';
                ctx.fillText('前端代码预览工具 - 代码摘要截图', 30, canvas.height - 15);
                
                const dataUrl = canvas.toDataURL('image/png');
                const base64 = dataUrl.split(',')[1];
                
                resolve({
                    success: true,
                    base64: base64,
                    dataUrl: dataUrl
                });
            } catch (fallbackError) {
                resolve({
                    success: false,
                    error: error.message
                });
            }
        }
    });
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