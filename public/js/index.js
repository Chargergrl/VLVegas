// Homepage Interactive Elements


  window.onload = function() {
    // var heading = document.querySelector('.fade-up');
    // setTimeout(function() {
    //   heading.style.opacity = '1';
    //   heading.style.transform = 'translateY(0)';
    // }, 1000); // Delay the heading animation for 1 second
  
    setTimeout(function() {
      const blackScreen = document.querySelector('#black-screen');
      blackScreen.style.transform = 'translateX(130%)';


      var homepageContent = document.getElementById('homepage');
      homepageContent.style.visibility = 'visible';
      homepageContent.style.opacity = '1';
      homepageContent.classList.remove('hidden');

      

    },3000); // Hide the black screen and show the homepage after 3 seconds
  };
  
  let headers = document.querySelectorAll('.heading');
  for (let i = 0; i < headers.length; i++) {
    let words = headers[i].innerHTML.split(' ');
    headers[i].innerHTML = '';
    for (let j = 0; j < words.length; j++) {
      let span = document.createElement('span');
      span.innerHTML = words[j] + ' '; // Add whitespace after each word
      span.style.animationDelay = (i + j) * 0.1 + 's';
      headers[i].appendChild(span);
    }
  }
  

  


// let heading = document.getElementById('heading');
// let words = heading.textContent.split(' ');
// heading.innerHTML = '';

// for (let i = 0; i < words.length; i++) {
//   let span = document.createElement('span');
//   span.textContent = words[i];
//   span.style.animationDelay = i * 0.1 + 's';
//   heading.appendChild(span);
// };





