// This file is injected as a content script
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './App';
import CommentToggle from './ToggleReddit';

const prepareComments = () => {
  if (window.location.href.includes('watch?v=')) {
    const mountNode = document.getElementById('comments');
    if (mountNode) {
      loadComments(mountNode);
    }
  }
};

const loadComments = (mountNode: HTMLElement | undefined) => {
  const ytComments = document.getElementById('comments');
  let redComments = document.getElementById('redComments');
  let redditImgWrap = document.getElementById('redditImgWrap');

  if (redComments) {
    redComments.remove();
    redditImgWrap!.remove();
  }

  redComments = document.createElement('div');
  redComments.setAttribute('id', 'redComments');
  redComments.style.marginTop = '20px';

  redditImgWrap = document.createElement('div');
  redditImgWrap.setAttribute('id', 'redditImgWrap');

  chrome.storage.sync.get('commentDefault', ({ commentDefault }) => {
    if (commentDefault) {
      redComments!.style.display = 'none';
      redditImgWrap!.style.display = 'flex';
    } else {
      ytComments!.style.display = 'none';
    }
  });

  mountNode!.parentNode!.insertBefore(redComments, mountNode!);
  mountNode!.parentNode!.insertBefore(redditImgWrap, mountNode!);

  chrome.storage.sync.get('sort', ({ sort }) => {
    ReactDOM.render(<App onYoutube sortSetting={sort} url={window.location.href} />, redComments);
    ReactDOM.render(<CommentToggle />, redditImgWrap);
  });
};

document.addEventListener('DOMContentLoaded', () => prepareComments());
document.addEventListener('yt-navigate-finish', () => prepareComments());
document.addEventListener('spfdone', () => prepareComments());

prepareComments();
