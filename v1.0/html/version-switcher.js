// 等待 DOM 加载完成
// == Version Switcher Sidebar Extension ==
document.addEventListener('DOMContentLoaded', function() {
  // 1. 插入 sidebar 扩展区结构
  function insertSidebarExtension() {
    // 查找 sidebar
    var sideNav = document.getElementById('side-nav');
    if (!sideNav) return null;
    // 检查是否已插入扩展区
    if (document.getElementById('sidebar-extensions')) return document.getElementById('sidebar-extensions');
    // 创建扩展区容器
    var extDiv = document.createElement('div');
    extDiv.id = 'sidebar-extensions';
    extDiv.innerHTML = `
      <div id="sidebar-extension-toggle">
        <span id="sidebar-extension-title"></span>
        <span class="sidebar-caret">▼</span>
      </div>
      <div id="sidebar-extension-panel" style="display:none">
        <div id="sidebar-version-switcher"></div>
        <!-- 预留：PDF/设置等扩展项 -->
      </div>
    `;
    // 插入到 side-nav 最后
    sideNav.appendChild(extDiv);
    return extDiv;
  }

  // 2. 注入样式（透明背景、主题色、动画、圆角、阴影、z-index）
  const style = document.createElement('style');
  style.textContent = `
    #sidebar-extensions {
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: 9999;
      background: transparent;
      box-sizing: border-box;
      padding-bottom: 8px;
      pointer-events: auto;
    }
    #sidebar-extension-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      font-size: 1em;
      color: var(--primary-color, #3498db);
      background: transparent;
      border-radius: 8px 8px 0 0;
      padding: 8px 16px 8px 12px;
      margin: 0 8px;
      user-select: none;
      transition: background 0.18s;
    }
    #sidebar-extension-toggle:hover, #sidebar-extension-toggle.active {
      background: var(--side-nav-hover, #f0f7fd);
    }
    .sidebar-caret {
      font-size: 0.9em;
      margin-left: 8px;
      transition: transform 0.2s;
    }
    #sidebar-extension-toggle.active .sidebar-caret {
      transform: rotate(180deg);
    }
    #sidebar-extension-panel {
      display: none;
      background: var(--side-nav-background, #fff);
      box-shadow: 0 -2px 16px rgba(52,152,219,0.13);
      border-radius: 0 0 12px 12px;
      margin: 0 8px 0 8px;
      padding: 12px 8px 8px 8px;
      animation: sidebarPanelFadeIn 0.25s;
      position: relative;
      z-index: 10000;
    }
    @keyframes sidebarPanelFadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    /* 版本切换器样式 */
    #sidebar-version-switcher {
      margin-bottom: 8px;
    }
    #sidebar-version-switcher .version-switcher-label {
      font-weight: 500;
      color: var(--primary-color, #3498db);
      margin-right: 8px;
    }
    #sidebar-version-switcher .version-switcher-dropdown {
      display: inline-block;
      position: relative;
    }
    #sidebar-version-switcher .version-switcher-current {
      cursor: pointer;
      color: var(--primary-color, #3498db);
      background: transparent;
      border: 1px solid var(--primary-color, #3498db);
      border-radius: 6px;
      padding: 2px 16px 2px 8px;
      font-size: 1em;
      min-width: 60px;
      user-select: none;
      transition: background 0.18s, color 0.18s;
    }
    #sidebar-version-switcher .version-switcher-current:hover {
      background: var(--side-nav-hover, #f0f7fd);
      color: #217dbb;
    }
    #sidebar-version-switcher .version-switcher-caret {
      font-size: 0.9em;
      margin-left: 4px;
      pointer-events: none;
    }
    #sidebar-version-switcher .version-switcher-dropdown-list {
      display: none;
      position: absolute;
      left: 0;
      top: 110%;
      background: var(--side-nav-background, #fff);
      border: 1px solid #e0e6ed;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(52,152,219,0.13);
      z-index: 10001;
      min-width: 100px;
      padding: 4px 0;
    }
    #sidebar-version-switcher .version-switcher-dropdown-list.show {
      display: block;
      animation: sidebarPanelFadeIn 0.18s;
    }
    #sidebar-version-switcher .version-switcher-option {
      padding: 8px 18px 8px 16px;
      cursor: pointer;
      font-size: 13px;
      color: #217dbb;
      border: none;
      background: none;
      border-radius: 0;
      transition: background 0.18s, color 0.18s;
      text-align: left;
    }
    #sidebar-version-switcher .version-switcher-option.selected {
      font-weight: bold;
      color: #145a86;
      background: #eaf3fa;
    }
    #sidebar-version-switcher .version-switcher-option:hover {
      background: #f0f7fd;
      color: #145a86;
      border-radius: 0 8px 8px 0;
    }
    @media (prefers-color-scheme: dark) {
      #sidebar-extension-panel, #sidebar-version-switcher .version-switcher-dropdown-list {
        background: #23272e;
        color: #fff;
        border-color: #444c56;
      }
      #sidebar-extension-toggle {
        color: #8ec2f7;
      }
      #sidebar-version-switcher .version-switcher-current {
        color: #8ec2f7;
        border-color: #8ec2f7;
      }
      #sidebar-version-switcher .version-switcher-option {
        color: #8ec2f7;
      }
      #sidebar-version-switcher .version-switcher-option.selected {
        color: #fff;
        background: #2c3e50;
      }
      #sidebar-version-switcher .version-switcher-option:hover {
        background: #34495e;
        color: #fff;
      }
    }
  `;
  document.head.appendChild(style);

  // 3. 初始化 sidebar 扩展区
  const extDiv = insertSidebarExtension();
  if (!extDiv) return;
  const toggleBtn = extDiv.querySelector('#sidebar-extension-toggle');
  const panel = extDiv.querySelector('#sidebar-extension-panel');
  const versionSwitcherContainer = extDiv.querySelector('#sidebar-version-switcher');
  const projectName = document.getElementById('projectname')?.childNodes[0]?.textContent?.trim() || 'Project';
  // 设置入口标题
  extDiv.querySelector('#sidebar-extension-title').textContent = `${projectName}  v:`;

  // 4. 展开/收起动画
  toggleBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    const isOpen = panel.style.display === 'block';
    panel.style.display = isOpen ? 'none' : 'block';
    toggleBtn.classList.toggle('active', !isOpen);
  });
  document.addEventListener('click', function() {
    panel.style.display = 'none';
    toggleBtn.classList.remove('active');
  });
  panel.addEventListener('click', e => e.stopPropagation());

  // 5. 版本切换器逻辑
  // 获取正确的 versions.json 路径
  const currentPath = window.location.pathname;
  const pathSegments = currentPath.split('/').filter(segment => segment);
  let versionsPath = './versions.json';
  if (pathSegments.length >= 3) {
    versionsPath = '../versions.json';
  } else if (pathSegments.length >= 2) {
    versionsPath = '../versions.json';
  }
  fetch(versionsPath)
    .then(res => res.ok ? res.json() : {versions:['latest','v1.0']})
    .then(data => {
      const versions = (data.versions && Array.isArray(data.versions)) ? data.versions : ['latest','v1.0'];
      createSidebarVersionSwitcher(versions);
    })
    .catch(() => createSidebarVersionSwitcher(['latest','v1.0']));

  function createSidebarVersionSwitcher(versions) {
    const currentVersion = pathSegments[1] || 'latest';
    const displayVersion = currentVersion === 'latest' ? 'main' : currentVersion;
    // 构建下拉
    versionSwitcherContainer.innerHTML = `
      <span class="version-switcher-label">版本</span>
      <span class="version-switcher-dropdown">
        <span class="version-switcher-current">${displayVersion}<span class="version-switcher-caret">▼</span></span>
        <div class="version-switcher-dropdown-list"></div>
      </span>
    `;
    const currentBtn = versionSwitcherContainer.querySelector('.version-switcher-current');
    const dropdownList = versionSwitcherContainer.querySelector('.version-switcher-dropdown-list');
    // 填充版本选项
    versions.forEach(version => {
      const optionText = version === 'latest' ? 'main' : version;
      const option = document.createElement('div');
      option.className = 'version-switcher-option' + (optionText === displayVersion ? ' selected' : '');
      option.textContent = optionText;
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        if (optionText === displayVersion) return;
        let targetUrl;
        if (version === 'latest') {
          targetUrl = '/docs/latest/html/';
        } else {
          targetUrl = `/docs/${version}/html/`;
        }
        window.location.href = targetUrl;
      });
      dropdownList.appendChild(option);
    });
    // 下拉展开/收起
    currentBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const isShow = dropdownList.classList.contains('show');
      dropdownList.classList.toggle('show', !isShow);
    });
    document.addEventListener('click', function() {
      dropdownList.classList.remove('show');
    });
    dropdownList.addEventListener('click', e => e.stopPropagation());
  }
});