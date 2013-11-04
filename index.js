
var up = document.getElementById('upload'),
    text1 = document.getElementById('text1'),
    text2 = document.getElementById('text2'),
    textSize = document.getElementById('textSize'),
    file  = document.getElementById('image'),
    canvas = document.getElementById('canvas'),
    uploaded = document.getElementById('uploaded');

var ctx = canvas.getContext("2d");

up.addEventListener('click', uploadToImgur);

text1.addEventListener('keyup', updateImage);
text2.addEventListener('keyup', updateImage);
file.addEventListener('change', changeAndUpdateImage);


function readFile(fileInput, callback) {
    var f = fileInput.files[0];
    var reader = new FileReader();
    reader.onload = (function(theFile) {
        return function(e) {
            callback(e.target.result);
        };
    })(f);
    reader.readAsDataURL(f);
}

var curImg = null;
function changeAndUpdateImage() {
    var img = new Image();
    readFile(file, function(dataURL) {
        img.onload = function() {
            curImg = img;
            canvas.width = img.width;
            canvas.height = img.height;
            //canvas.style.height = img.height + 'px';
            //canvas.style.width = img.width + 'px';
            ctx = canvas.getContext("2d");
            updateImage();
        }
        img.src = dataURL;

    });
       
}

function drawLines(ctx, lines, x, y, yStep) {
    lines = lines.split('\n');
    if (yStep < 0) lines = lines.reverse();
    lines.forEach(function(l, k) {
        ctx.strokeText(l, curImg.width / 2, y + yStep * k);
        ctx.fillText(l,   curImg.width / 2, y + yStep * k);
 
    });
}

function updateImage() {
    var txtSize = parseFloat(textSize.value) || 24;

    if (!curImg) return;
    
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, curImg.width, curImg.height);
    ctx.drawImage(curImg, 0, 0);
    ctx.font = txtSize + "px Arial";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 3;

    drawLines(ctx, text1.value, curImg.width / 2, 
              txtSize, 1.33 * txtSize);
    drawLines(ctx, text2.value, curImg.width / 2, 
              curImg.height - txtSize, -1.33 * txtSize );

    console.log(text1.value, text2.value);
}



function uploadToImgur() {

    var img;
    try {
        img = canvas.toDataURL('image/png', 1.0).split(',')[1];
    } catch(e) {
        img = canvas.toDataURL().split(',')[1];
    }

    console.log(img);
    $.ajax({
        url: 'https://api.imgur.com/3/upload.json',
        type: 'POST',
        data: {
            type: 'base64',
            // get your key here, quick and fast http://imgur.com/register/api_anon
            name: 'meme.png',
            title: text1.value,
            description: text2.value,
            image: img
        },
        headers: {
            Authorization: 'Client-ID 4b64f0eff077008'
        },
        dataType: 'json'
    }).success(function(data) {
        var l = data.data.link;
        uploaded.innerHTML = '<a href="' + l + '">'
        + l
        + '</a>';
    }).error(function(err) {
        console.error(err);
    });

}
