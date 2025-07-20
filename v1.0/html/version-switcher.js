// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {
  console.log('Version switcher: DOM loaded');
  
  // 清理旧的版本切换器元素
  const oldVersionSwitcher = document.getElementById('version-switcher');
  if (oldVersionSwitcher) {
    oldVersionSwitcher.remove();
  }
  const oldDropdown = document.getElementById('version-dropdown');
  if (oldDropdown) {
    oldDropdown.remove();
  }
  
  // 注入美观的CSS样式
  const style = document.createElement('style');
  style.textContent = `
    #projectnumber {
      cursor: pointer !important;
      color: #3498db !important;
      transition: color 0.2s ease;
      position: relative;
      display: inline-flex;
      align-items: center;
      font-weight: 500;
      background: #fff;
      border-radius: 6px;
      padding: 2px 10px 2px 8px;
      box-shadow: 0 1px 4px rgba(52,152,219,0.07);
      border: 1px solid #e0e6ed;
      gap: 4px;
      user-select: none;
    }
    #projectnumber:hover, #projectnumber.active {
      background: #f0f7fd;
      color: #217dbb !important;
      border-color: #b5d6f6;
    }
    .dropdown-caret {
      font-size: 0.85em;
      color: #888;
      margin-left: 4px;
      transition: transform 0.2s;
      pointer-events: none;
    }
    #projectnumber.active .dropdown-caret {
      transform: rotate(180deg);
      color: #217dbb;
    }
    #version-dropdown {
      position: absolute !important;
      top: calc(100% + 4px) !important;
      right: 0 !important;
      background: #fff !important;
      border: 1px solid #e0e6ed !important;
      border-radius: 8px !important;
      box-shadow: 0 4px 16px rgba(52,152,219,0.13) !important;
      z-index: 9999 !important;
      min-width: 120px !important;
      font-family: inherit !important;
      padding: 4px 0 !important;
      display: none;
    }
    #version-dropdown div {
      padding: 8px 18px 8px 16px !important;
      cursor: pointer !important;
      font-size: 13px !important;
      color: #217dbb !important;
      border: none !important;
      background: none !important;
      border-radius: 0 !important;
      transition: background 0.18s, color 0.18s;
      text-align: left;
    }
    #version-dropdown div:hover {
      background: #f0f7fd !important;
      color: #145a86 !important;
      border-radius: 0 8px 8px 0;
    }
    #version-dropdown div.selected {
      font-weight: bold;
      color: #145a86 !important;
      background: #eaf3fa !important;
    }
  `;
  document.head.appendChild(style);

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
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (!data.versions || !Array.isArray(data.versions)) {
        return createVersionSwitcher(['latest', 'v1.0']);
      }
      return createVersionSwitcher(data.versions);
    })
    .catch(() => createVersionSwitcher(['latest', 'v1.0']));

  function createVersionSwitcher(versions) {
    const currentVersion = pathSegments[1] || 'latest';
    const projectNumber = document.getElementById('projectnumber');
    if (projectNumber) {
      // 构建版本号+下拉符号
      const displayVersion = currentVersion === 'latest' ? 'main' : currentVersion;
      projectNumber.innerHTML = `<span class="version-label">${displayVersion}</span><span class="dropdown-caret">▼</span>`;
      projectNumber.title = '点击切换文档版本';
      projectNumber.classList.remove('active');

      // 创建下拉菜单
      const dropdown = document.createElement('div');
      dropdown.id = 'version-dropdown';
      dropdown.style.display = 'none';
      versions.forEach(version => {
        const option = document.createElement('div');
        const optionText = version === 'latest' ? 'main' : version;
        option.textContent = optionText;
        if (optionText === displayVersion) {
          option.classList.add('selected');
        }
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
        dropdown.appendChild(option);
      });
      // 右对齐到 projectnumber
      projectNumber.style.position = 'relative';
      projectNumber.appendChild(dropdown);

      // 切换下拉菜单显示
      function toggleDropdown(e) {
        e.stopPropagation();
        const isVisible = dropdown.style.display === 'block';
        dropdown.style.display = isVisible ? 'none' : 'block';
        projectNumber.classList.toggle('active', !isVisible);
      }
      projectNumber.addEventListener('click', toggleDropdown);
      // 点击外部关闭
      document.addEventListener('click', function() {
        dropdown.style.display = 'none';
        projectNumber.classList.remove('active');
      });
      // 防止菜单点击冒泡
      dropdown.addEventListener('click', e => e.stopPropagation());
    }
  }
});