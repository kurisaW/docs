// 等待 DOM 加载完成
// == Version Switcher Projectnumber Optimized ==
document.addEventListener('DOMContentLoaded', function() {
  // 清理旧的版本切换器元素
  const oldVersionSwitcher = document.getElementById('version-switcher');
  if (oldVersionSwitcher) oldVersionSwitcher.remove();
  const oldDropdown = document.getElementById('version-dropdown');
  if (oldDropdown) oldDropdown.remove();

  // 注入优化样式
  const style = document.createElement('style');
  style.textContent = `
    #projectnumber {
      cursor: pointer !important;
      color: var(--primary-color, #3498db) !important;
      background: var(--page-background-color, #fff) !important;
      border: 1.5px solid var(--primary-color, #3498db) !important;
      border-radius: 8px 8px 8px 8px !important;
      box-shadow: 0 1px 8px rgba(52,152,219,0.07);
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-weight: 500;
      padding: 2px 16px 2px 12px;
      user-select: none;
      position: relative;
      z-index: 10010;
      transition: background 0.18s, color 0.18s, border-color 0.18s;
    }
    #projectnumber:hover, #projectnumber.active {
      background: var(--side-nav-hover, #f0f7fd) !important;
      color: #217dbb !important;
      border-color: #217dbb !important;
    }
    .dropdown-caret {
      font-size: 0.95em;
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
      top: calc(100% + 2px) !important;
      left: 0 !important;
      width: 100% !important;
      background: var(--page-background-color, #fff) !important;
      border: 1.5px solid var(--primary-color, #3498db) !important;
      border-radius: 0 0 8px 8px !important;
      box-shadow: 0 4px 16px rgba(52,152,219,0.13) !important;
      z-index: 10020 !important;
      min-width: 120px !important;
      font-family: inherit !important;
      padding: 4px 0 !important;
      display: none;
      animation: fadeInDropdown 0.18s;
    }
    @keyframes fadeInDropdown {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    #version-dropdown div {
      padding: 8px 18px 8px 16px !important;
      cursor: pointer !important;
      font-size: 13px !important;
      color: var(--primary-color, #217dbb) !important;
      border: none !important;
      background: none !important;
      border-radius: 0 !important;
      transition: background 0.18s, color 0.18s;
      text-align: left;
    }
    #version-dropdown div.selected {
      font-weight: bold;
      color: #145a86 !important;
      background: #eaf3fa !important;
    }
    #version-dropdown div:hover {
      background: var(--side-nav-hover, #f0f7fd) !important;
      color: #145a86 !important;
      border-radius: 0 8px 8px 0;
    }
    @media (prefers-color-scheme: dark) {
      #projectnumber, #version-dropdown {
        background: var(--side-nav-background, #23272e) !important;
        color: #8ec2f7 !important;
        border-color: #8ec2f7 !important;
      }
      #projectnumber:hover, #projectnumber.active {
        background: #34495e !important;
        color: #fff !important;
        border-color: #8ec2f7 !important;
      }
      #version-dropdown div {
        color: #8ec2f7 !important;
      }
      #version-dropdown div.selected {
        color: #fff !important;
        background: #2c3e50 !important;
      }
      #version-dropdown div:hover {
        background: #34495e !important;
        color: #fff !important;
      }
    }
  `;
  document.head.appendChild(style);
  console.log('Version switcher: CSS injected');

  // 获取正确的 versions.json 路径
  const currentPath = window.location.pathname;
  const pathSegments = currentPath.split('/').filter(segment => segment);
  let versionsPath = './versions.json';
  if (pathSegments.length >= 3) {
    versionsPath = '../versions.json';
  } else if (pathSegments.length >= 2) {
    versionsPath = '../versions.json';
  }
  console.log('Version switcher: Fetching from:', versionsPath);

  fetch(versionsPath)
    .then(res => {
      console.log('Version switcher: Response status:', res.status);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log('Version switcher: Received data:', data);
      if (!data.versions || !Array.isArray(data.versions)) {
        console.log('Version switcher: Using fallback versions');
        return createVersionSwitcher(['latest', 'v1.0']);
      }
      return createVersionSwitcher(data.versions);
    })
    .catch(error => {
      console.error('Version switcher: Error:', error);
      return createVersionSwitcher(['latest', 'v1.0']);
    });

  function createVersionSwitcher(versions) {
    const currentVersion = pathSegments[1] || 'latest';
    const projectNumber = document.getElementById('projectnumber');
    console.log('Version switcher: Current version:', currentVersion);
    console.log('Version switcher: Available versions:', versions);
    
    if (projectNumber) {
      console.log('Version switcher: Found project number element');
      // 构建版本号+下拉符号
      const displayVersion = currentVersion === 'latest' ? 'main' : currentVersion;
      projectNumber.innerHTML = `<span class="version-label">${displayVersion}</span><span class="dropdown-caret">▼</span>`;
      projectNumber.title = '点击切换文档版本';
      projectNumber.classList.remove('active');
      console.log('Version switcher: Set display version to:', displayVersion);

      // 创建下拉菜单
      const dropdown = document.createElement('div');
      dropdown.id = 'version-dropdown';
      dropdown.style.display = 'none';
      dropdown.style.width = '100%';
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
          console.log('Version switcher: Navigating to:', targetUrl);
          window.location.href = targetUrl;
        });
        dropdown.appendChild(option);
      });
      // 右对齐到 projectnumber
      projectNumber.style.position = 'relative';
      projectNumber.appendChild(dropdown);
      console.log('Version switcher: Added dropdown to project number');

      // 切换下拉菜单显示
      function toggleDropdown(e) {
        e.stopPropagation();
        const isVisible = dropdown.style.display === 'block';
        const newDisplay = isVisible ? 'none' : 'block';
        dropdown.style.display = newDisplay;
        projectNumber.classList.toggle('active', !isVisible);
        if (newDisplay === 'block') {
          dropdown.style.setProperty('display', 'block', 'important');
        }
        // 保证z-index
        dropdown.style.zIndex = '10020';
      }
      projectNumber.addEventListener('click', toggleDropdown);
      // 点击外部关闭
      document.addEventListener('click', function() {
        dropdown.style.display = 'none';
        projectNumber.classList.remove('active');
      });
      // 防止菜单点击冒泡
      dropdown.addEventListener('click', e => e.stopPropagation());
      console.log('Version switcher: Successfully initialized');
    } else {
      console.log('Version switcher: Project number element not found');
    }
  }
});