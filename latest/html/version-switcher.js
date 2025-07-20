fetch('./versions.json')
  .then(res => res.json())
  .then(data => {
    const currentVersion = window.location.pathname.split('/')[1] || 'latest';
    const switcher = `
      <div id="version-switcher">
        <select onchange="location.href='../' + this.value + '/'">
          ${data.versions.map(v => 
            `<option value="${v}" ${v === currentVersion ? 'selected' : ''}>
              ${v === 'latest' ? 'main' : v}
            </option>`
          ).join('')}
        </select>
      </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', switcher);
  });