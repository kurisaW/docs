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
    
    const switcher = `
      <div id="version-switcher">
        <select onchange="location.href='../' + this.value + '/html/'">
          ${versions.map(v => 
            `<option value="${v}" ${v === currentVersion ? 'selected' : ''}>
              ${v === 'latest' ? 'main' : v}
            </option>`
          ).join('')}
        </select>
      </div>
    `;
    
    // 查找项目编号元素并插入版本切换器
    const projectNumber = document.getElementById('projectnumber');
    if (projectNumber) {
      console.log('Version switcher: Found project number element, inserting after it');
      // 在项目编号后插入版本切换器
      projectNumber.insertAdjacentHTML('afterend', switcher);
    } else {
      // 如果找不到项目编号，尝试在项目名称区域插入
      const projectName = document.getElementById('projectname');
      if (projectName) {
        console.log('Version switcher: Found project name element, inserting after it');
        projectName.insertAdjacentHTML('afterend', switcher);
      } else {
        console.log('Version switcher: No suitable element found, inserting at body start');
        document.body.insertAdjacentHTML('afterbegin', switcher);
      }
    }
    
    console.log('Version switcher: Successfully inserted');
  }
});