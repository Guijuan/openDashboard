var image_color = []
var lut = []
var lut_midcut = []

function preprocess() {
    let dic = {}
    let len = image_color.length
    let temp = []
    for (let i = 0; i < len; i++) {
        if (dic[image_color[i]]) dic[image_color[i]]++
        else dic[image_color[i]] = 1
    }
    let res = Object.keys(dic).sort((a,b) => dic[b] - dic[a])
    for(let key in res) {
        if ((dic[res[key]] / len) >= 0.3) {
            let arr = []
            res[key].split(',').forEach(item => arr.push(+item))
            lut.push(arr)
            temp.push(arr)
        }
        else break
    }
    let new_image_color = []
    for (let i = 0; i < len; i++) {
        let flag = true
        for (let j = 0; j < temp.length; j++) {
            if (image_color[i].toString() == temp[j].toString()) {
                flag = false
                break
            }
        }
        if (flag) {
            new_image_color.push(image_color[i])
        }
    }
    return new_image_color
}

function median_cut(color_list, depth) {
    let len = color_list.length
    if (depth == 1) {
        let sumr = 0, sumg = 0, sumb = 0
        for (let i = 0; i < len; i++) {
            sumr += color_list[i][0]
            sumg += color_list[i][1]
            sumb += color_list[i][2]
        }
        sumr = Math.floor(sumr / len)
        sumg = Math.floor(sumg / len)
        sumb = Math.floor(sumb / len)
        lut_midcut.push([sumr, sumg, sumb])
        return
    }

    let max_r = 0, min_r = 255, max_g = 0, min_g = 255, max_b = 0, min_b = 255
    for (let i = 0; i < len; i++) {
        max_r = Math.max(max_r, color_list[i][0])
        min_r = Math.min(min_r, color_list[i][0])

        max_g = Math.max(max_g, color_list[i][1])
        min_g = Math.min(min_g, color_list[i][1])

        max_b = Math.max(max_b, color_list[i][2])
        min_b = Math.min(min_b, color_list[i][2])
    }

    let diffr = max_r - min_r, diffb = max_b - min_b, diffg = max_g - min_g
    let cmp = Math.max(diffg, diffb, diffr)
    if (cmp == diffr) {
        color_list.sort((a, b) => a[0] - b[0])
    }
    else if (cmp == diffg) {
        color_list.sort((a, b) => a[2] - b[2])
    }
    else {
        color_list.sort((a, b) => a[1] - b[1])
    }
    let mid = len >> 1
    median_cut(color_list.slice(0, mid), depth - 1)
    median_cut(color_list.slice(mid, len), depth - 1)
}

function eucDistance2(a, b) {
    let sum = Math.pow(a[0]-b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2)
    return Math.sqrt(sum)
}

function reprocess() {
    let len = lut_midcut.length
    for (let i = 0; i < len; i++) {
        let flag = true
        let lut_len = lut.length
        for (let j = 0; j < lut_len; j++) {
            if (eucDistance2(lut[j], lut_midcut[i]) <= 25) {
                flag = false
                break
            }
        }
        if (flag) {
            lut.push(lut_midcut[i])
        }
    }
}

export function themeColor(img) {
    image_color = []
    lut = []
    lut_midcut = []
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var width = 0;
    var height = 0;
    var imageData;
    canvas.width = img.width;
    width = canvas.width;
    canvas.height = img.height;
    height = canvas.height;
    ctx.drawImage(img, 0, 0, width, height);
    imageData = ctx.getImageData(0, 0, width, height).data;
    var total = imageData.length / 4;
    for (let i = 0; i < total; i++) {
        let red = imageData[i * 4];
        let green = imageData[i * 4 + 1];
        let blue = imageData[i * 4 + 2];
        image_color.push([red, green, blue]);
    }
    image_color = preprocess()
    median_cut(image_color, 6)
    reprocess()
    return lut
}
