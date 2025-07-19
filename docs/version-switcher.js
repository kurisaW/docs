// 动态加载 versions.json 并生成下拉菜单
fetch('/versions.json')
  .then(res => res.json())
  .then(data => {
    const currentVersion = document.querySelector('meta[name="project-version"]').content;
    const switcher = document.createElement('div');
    switcher.id = 'version-switcher';
    switcher.innerHTML = `
      <select onchange="location.href='/' + this.value">
        ${data.versions.map(v => 
          `<option value="${v}" ${v === currentVersion ? 'selected' : ''}>${v}</option>`
        ).join('')}
      </select>
    `;
    document.body.prepend(switcher);
  });