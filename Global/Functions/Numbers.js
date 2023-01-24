const sayilariCevir = global.sayilariCevir = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const sayılıEmoji = global.sayılıEmoji = function(sayi) {
    var basamakbir = sayi.toString().replace(/ /g, "     ");
    var basamakiki = basamakbir.match(/([0-9])/g);
    basamakbir = basamakbir.replace(/([a-zA-Z])/g, "Belirlenemiyor").toLowerCase();
    if (basamakiki) {
        basamakbir = basamakbir.replace(/([0-9])/g, d => {
            return {
                "0": client.guilds.cache.get(sistem.SERVER.ID).emojiGöster(emojiler.Numbers.Zero),
                "1": client.guilds.cache.get(sistem.SERVER.ID).emojiGöster(emojiler.Numbers.One),
                "2": client.guilds.cache.get(sistem.SERVER.ID).emojiGöster(emojiler.Numbers.Two),
                "3": client.guilds.cache.get(sistem.SERVER.ID).emojiGöster(emojiler.Numbers.Three),
                "4": client.guilds.cache.get(sistem.SERVER.ID).emojiGöster(emojiler.Numbers.Four),
                "5": client.guilds.cache.get(sistem.SERVER.ID).emojiGöster(emojiler.Numbers.Five),
                "6": client.guilds.cache.get(sistem.SERVER.ID).emojiGöster(emojiler.Numbers.Six),
                "7": client.guilds.cache.get(sistem.SERVER.ID).emojiGöster(emojiler.Numbers.Seven),
                "8": client.guilds.cache.get(sistem.SERVER.ID).emojiGöster(emojiler.Numbers.Eight),
                "9": client.guilds.cache.get(sistem.SERVER.ID).emojiGöster(emojiler.Numbers.Nine)
            }[d];
        });
    }
    return basamakbir;
}

Array.prototype.chunk = function(chunk_size) {
    let myArray = Array.from(this);
    let tempArray = [];
    for (let index = 0; index < myArray.length; index += chunk_size) {
      let chunk = myArray.slice(index, index + chunk_size);
      tempArray.push(chunk);
    }
    return tempArray;
  };

Array.prototype.shuffle = function () {
    let i = this.length;
    while (i) {
      let j = Math.floor(Math.random() * i);
      let t = this[--i];
      this[i] = this[j];
      this[j] = t;
    }
    return this;
  };