function createList() {
    const ul = document.createElement('ul');

    for (let i = 0; i < 5; ++i) {
        const li = document.createElement('li');
        li.textContent = `#${i + 1} Li Element`;
        ul.appendChild(li);
    }

    return ul;
}

export {
    createList
}