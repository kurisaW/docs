// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {
  console.log('Version switcher: DOM loaded');
  
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
    
    // 查找项目编号元素
    const projectNumber = document.getElementById('projectnumber');
    if (projectNumber) {
      console.log('Version switcher: Found project number element, modifying it');
      
      // 设置当前版本显示
      const displayVersion = currentVersion === 'latest' ? 'main' : currentVersion;
      projectNumber.textContent = displayVersion;
      
      // 添加提示文本
      projectNumber.title = 'Click to switch version';
      
      // 创建版本选择下拉菜单
      const dropdown = document.createElement('div');
      dropdown.id = 'version-dropdown';
      
      // 添加版本选项
      versions.forEach(version => {
        const option = document.createElement('div');
        option.textContent = version === 'latest' ? 'main' : version;
        
        option.addEventListener('click', () => {
          const targetVersion = version === 'latest' ? 'latest' : version;
          window.location.href = '../' + targetVersion + '/html/';
        });
        
        dropdown.appendChild(option);
      });
      
      // 将下拉菜单添加到项目编号的父元素
      projectNumber.parentNode.style.position = 'relative';
      projectNumber.parentNode.appendChild(dropdown);
      
      // 添加点击事件
      projectNumber.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = dropdown.style.display === 'block';
        dropdown.style.display = isVisible ? 'none' : 'block';
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