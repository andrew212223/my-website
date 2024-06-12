// static/js/modal.js

let isDragging = false;
let isResizing = false;
let offsetX, offsetY;
let resizeDirection;

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('.modal');
    const restoreIcon = document.getElementById('restore-icon');

    modal.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('header')) {
            isDragging = true;
            offsetX = e.clientX - modal.getBoundingClientRect().left;
            offsetY = e.clientY - modal.getBoundingClientRect().top;
        } else if (e.target.classList.contains('resizer')) {
            isResizing = true;
            resizeDirection = e.target.dataset.direction;
            offsetX = e.clientX;
            offsetY = e.clientY;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            modal.style.left = `${e.clientX - offsetX}px`;
            modal.style.top = `${e.clientY - offsetY}px`;
        } else if (isResizing) {
            const rect = modal.getBoundingClientRect();
            switch (resizeDirection) {
                case 'right':
                    modal.style.width = `${rect.width + (e.clientX - offsetX)}px`;
                    offsetX = e.clientX;
                    break;
                case 'bottom':
                    modal.style.height = `${rect.height + (e.clientY - offsetY)}px`;
                    offsetY = e.clientY;
                    break;
                case 'bottom-right':
                    modal.style.width = `${rect.width + (e.clientX - offsetX)}px`;
                    modal.style.height = `${rect.height + (e.clientY - offsetY)}px`;
                    offsetX = e.clientX;
                    offsetY = e.clientY;
                    break;
            }
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        isResizing = false;
    });

    document.querySelector('.header button[minimize]').addEventListener('click', () => {
        modal.style.display = 'none';
        restoreIcon.style.display = 'flex';
    });

    document.querySelector('.header button[close]').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    restoreIcon.addEventListener('click', () => {
        modal.style.display = 'block';
        restoreIcon.style.display = 'none';
    });
});
