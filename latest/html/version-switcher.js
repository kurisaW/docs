// == Version Switcher Projectnumber Optimized (Body-level Dropdown) ==
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
      border-radius: 8px !important;
      box-shadow: 0 1px 8px rgba(52,152,219,0.07);
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-weight: 500;
      padding: 2px 16px 2px 12px;
      user-select: none;
      position: relative;
      z-index: 10010;
      transition: background 0.18s, color 0.18s, border-color 0.18s;
      justify-content: center;
    }
    #projectnumber .version-label {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
    }
    #projectnumber:hover, #projectnumber.active {
      background: var(--side-nav-hover, #f0f7fd) !important;
      color: #217dbb !important;
      border-color: #217dbb !important;
    }
    .dropdown-caret {
      font-size: 1em;
      color: #888;
      margin-left: 4px;
      transition: transform 0.2s;
      pointer-events: none;
      display: flex;
      align-items: center;
    }
    #projectnumber.active .dropdown-caret {
      transform: rotate(180deg);
      color: #217dbb;
    }
    .body-version-dropdown {
      position: absolute !important;
      left: 0;
      top: 0;
      width: 200px;
      background: var(--page-background-color, #fff) !important;
      border: 1.5px solid var(--primary-color, #3498db) !important;
      border-radius: 0 0 8px 8px !important;
      box-shadow: 0 4px 16px rgba(52,152,219,0.13) !important;
      z-index: 99999 !important;
      min-width: 120px !important;
      font-family: inherit !important;
      padding: 4px 0 !important;
      display: none;
      animation: fadeInDropdown 0.18s;
      max-height: 320px;
      overflow-y: auto;
    }
    @keyframes fadeInDropdown {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .body-version-dropdown div {
      padding: 8px 18px 8px 16px !important;
      cursor: pointer !important;
      font-size: 13px !important;
      color: var(--primary-color, #217dbb) !important;
      border: none !important;
      background: none !important;
      border-radius: 0 !important;
      transition: background 0.18s, color 0.18s;
      text-align: left;
      display: block;
    }
    .body-version-dropdown div.selected {
      font-weight: bold;
      color: #145a86 !important;
      background: #eaf3fa !important;
    }
    .body-version-dropdown div:hover {
      background: var(--side-nav-hover, #f0f7fd) !important;
      color: #145a86 !important;
      border-radius: 0 8px 8px 0;
    }
    @media (prefers-color-scheme: dark) {
      #projectnumber, .body-version-dropdown {
        background: var(--side-nav-background, #23272e) !important;
        color: #8ec2f7 !important;
        border-color: #8ec2f7 !important;
      }
      #projectnumber:hover, #projectnumber.active {
        background: #34495e !important;
        color: #fff !important;
        border-color: #8ec2f7 !important;
      }
      .body-version-dropdown div {
        color: #8ec2f7 !important;
      }
      .body-version-dropdown div.selected {
        color: #fff !important;
        background: #2c3e50 !important;
      }
      .body-version-dropdown div:hover {
        background: #34495e !important;
        color: #fff !important;
      }
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
    .then(res => res.ok ? res.json() : {versions:['latest','v1.0']})
    .then(data => {
      const versions = (data.versions && Array.isArray(data.versions)) ? data.versions : ['latest','v1.0'];
      createVersionSwitcher(versions);
    })
    .catch(() => createVersionSwitcher(['latest','v1.0']));

  function createVersionSwitcher(versions) {
    const currentVersion = pathSegments[1] || 'latest';
    const projectNumber = document.getElementById('projectnumber');
    if (!projectNumber) return;
    // 构建版本号+下拉符号
    const displayVersion = currentVersion === 'latest' ? 'main' : currentVersion;
    projectNumber.innerHTML = `<span class="version-label">${displayVersion}</span><span class="dropdown-caret">▼</span>`;
    projectNumber.title = '点击切换文档版本';
    projectNumber.classList.remove('active');
    projectNumber.style.textAlign = 'center';
    projectNumber.style.justifyContent = 'center';

    // 创建body级下拉菜单
    let dropdown = document.getElementById('version-dropdown');
    if (dropdown) dropdown.remove();
    dropdown = document.createElement('div');
    dropdown.id = 'version-dropdown';
    dropdown.className = 'body-version-dropdown';
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
    document.body.appendChild(dropdown);

    // 展开/收起下拉菜单
    function toggleDropdown(e) {
      e.stopPropagation();
      const isVisible = dropdown.style.display === 'block';
      if (isVisible) {
        dropdown.style.display = 'none';
        projectNumber.classList.remove('active');
        return;
      }
      // 计算projectnumber在页面的位置
      const rect = projectNumber.getBoundingClientRect();
      dropdown.style.width = rect.width + 'px';
      dropdown.style.left = rect.left + window.scrollX + 'px';
      dropdown.style.top = (rect.bottom + window.scrollY - 1) + 'px';
      dropdown.style.display = 'block';
      projectNumber.classList.add('active');
    }
    projectNumber.addEventListener('click', toggleDropdown);
    // 点击外部关闭
    document.addEventListener('click', function(e) {
      if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
        projectNumber.classList.remove('active');
      }
    });
    // 防止菜单点击冒泡
    dropdown.addEventListener('click', e => e.stopPropagation());
    // 窗口resize/scroll时自动关闭
    window.addEventListener('resize', () => { dropdown.style.display = 'none'; projectNumber.classList.remove('active'); });
    window.addEventListener('scroll', () => { dropdown.style.display = 'none'; projectNumber.classList.remove('active'); });
  }
});