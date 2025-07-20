// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {
  console.log('Version switcher: DOM loaded');
  
  // 清理旧的版本切换器元素
  const oldVersionSwitcher = document.getElementById('version-switcher');
  if (oldVersionSwitcher) {
    console.log('Version switcher: Removing old version switcher element');
    oldVersionSwitcher.remove();
  }
  
  // 清理旧的下拉菜单
  const oldDropdown = document.getElementById('version-dropdown');
  if (oldDropdown) {
    console.log('Version switcher: Removing old dropdown element');
    oldDropdown.remove();
  }
  
  // 直接注入CSS样式
  const style = document.createElement('style');
  style.textContent = `
    #projectnumber {
      cursor: pointer !important;
      text-decoration: underline !important;
      color: #3498db !important;
      transition: color 0.2s ease;
      position: relative;
      border: 2px solid red !important;
    }
    
    #projectnumber:hover {
      color: #2980b9 !important;
    }
    
    #version-dropdown {
      position: absolute !important;
      top: 100% !important;
      left: 0 !important;
      background: white !important;
      border: 1px solid #ddd !important;
      border-radius: 4px !important;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
      z-index: 1000 !important;
      display: none !important;
      min-width: 100px !important;
      font-family: inherit !important;
    }
    
    #version-dropdown div {
      padding: 8px 12px !important;
      cursor: pointer !important;
      border-bottom: 1px solid #eee !important;
      font-size: 12px !important;
      transition: background-color 0.2s ease !important;
    }
    
    #version-dropdown div:hover {
      background-color: #f5f5f5 !important;
    }
    
    #version-dropdown div:last-child {
      border-bottom: none !important;
    }
  `;
  document.head.appendChild(style);
  console.log('Version switcher: Injected CSS styles');
  
  // 获取正确的 versions.json 路径
  const currentPath = window.location.pathname;
  const pathSegments = currentPath.split('/').filter(segment => segment);
  
  console.log('Version switcher: Current path:', currentPath);
  console.log('Version switcher: Path segments:', pathSegments);
  
  // 根据当前路径确定 versions.json 的位置
  let versionsPath = './versions.json';
  
  // 如果在子目录中，需要回到根目录
  if (pathSegments.length >= 3) {
    // 从 /docs/latest/html/index.html 回到 /docs/latest/versions.json
    versionsPath = '../versions.json';
  } else if (pathSegments.length >= 2) {
    // 从 /docs/latest/ 回到 /docs/versions.json
    versionsPath = '../versions.json';
  }
  
  console.log('Version switcher: Fetching versions from:', versionsPath);
  
  // 备用版本列表
  const fallbackVersions = ['latest', 'v1.0'];
  
  fetch(versionsPath)
    .then(res => {
      console.log('Version switcher: Response status:', res.status);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      console.log('Version switcher: Received data:', data);
      if (!data.versions || !Array.isArray(data.versions)) {
        console.warn('Invalid versions.json format, using fallback');
        return createVersionSwitcher(fallbackVersions);
      }
      
      return createVersionSwitcher(data.versions);
    })
    .catch(error => {
      console.error('Failed to load version switcher:', error);
      console.log('Using fallback version list');
      return createVersionSwitcher(fallbackVersions);
    });
    
  function createVersionSwitcher(versions) {
    const currentVersion = pathSegments[1] || 'latest'; // 从路径中获取版本号
    console.log('Version switcher: Current version:', currentVersion);
    console.log('Version switcher: Available versions:', versions);
    
    // 查找项目编号元素
    const projectNumber = document.getElementById('projectnumber');
    if (projectNumber) {
      console.log('Version switcher: Found project number element, modifying it');
      
      // 检查CSS是否加载（红色边框测试）
      const computedStyle = window.getComputedStyle(projectNumber);
      console.log('Version switcher: Project number border:', computedStyle.border);
      console.log('Version switcher: CSS loaded:', computedStyle.border.includes('red'));
      
      // 设置当前版本显示
      const displayVersion = currentVersion === 'latest' ? 'main' : currentVersion;
      projectNumber.textContent = displayVersion;
      console.log('Version switcher: Set display version to:', displayVersion);
      
      // 添加提示文本
      projectNumber.title = 'Click to switch version';
      
      // 创建版本选择下拉菜单
      const dropdown = document.createElement('div');
      dropdown.id = 'version-dropdown';
      
      console.log('Version switcher: Creating dropdown with versions:', versions);
      
      // 添加版本选项
      versions.forEach(version => {
        const option = document.createElement('div');
        const optionText = version === 'latest' ? 'main' : version;
        option.textContent = optionText;
        
        console.log('Version switcher: Adding option:', optionText);
        
        option.addEventListener('click', () => {
          const targetVersion = version === 'latest' ? 'latest' : version;
          console.log('Version switcher: Switching to version:', targetVersion);
          window.location.href = '../' + targetVersion + '/html/';
        });
        
        option.addEventListener('mouseenter', () => {
          option.style.backgroundColor = '#f5f5f5';
        });
        
        option.addEventListener('mouseleave', () => {
          option.style.backgroundColor = 'white';
        });
        
        dropdown.appendChild(option);
      });
      
      // 将下拉菜单添加到项目编号的父元素
      const parentElement = projectNumber.parentNode;
      parentElement.style.position = 'relative';
      parentElement.appendChild(dropdown);
      console.log('Version switcher: Added dropdown to parent element');
      console.log('Version switcher: Dropdown element:', dropdown);
      console.log('Version switcher: Dropdown style.display:', dropdown.style.display);
      
      // 添加点击事件
      projectNumber.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = dropdown.style.display === 'block';
        dropdown.style.display = isVisible ? 'none' : 'block';
        console.log('Version switcher: Toggle dropdown, new state:', dropdown.style.display);
        console.log('Version switcher: Dropdown computed style:', window.getComputedStyle(dropdown).display);
        
        // 强制重绘
        dropdown.offsetHeight;
      });
      
      // 点击其他地方关闭下拉菜单
      document.addEventListener('click', () => {
        dropdown.style.display = 'none';
      });
      
      console.log('Version switcher: Successfully modified project number element');
    } else {
      console.log('Version switcher: Project number element not found');
    }
  }
});