var Jeu = {
  carte : [
         [1,1,1,2,2,2,2,2,2,2,2],
         [1,1,1,2,2,2,2,2,2,2,2],
         [1,1,1,2,2,2,2,2,2,2,2],
         [2,2,2,2,2,2,2,2,2,2,2],
         [1,2,2,2,2,0,0,0,0,2,2],
         [2,2,1,2,2,0,0,0,0,2,2],
         [2,2,2,2,2,2,2,2,2,2,2],
         [2,2,2,2,0,2,2,2,2,2,2],
         [2,2,2,2,2,2,2,0,2,2,2],
         [2,2,2,2,2,2,2,2,2,2,2],
         [2,2,2,2,2,2,2,1,2,2,2],
  ],

  images: Array(),

  nb_cases_largeur:0,
  nb_cases_hauteur:0,
  x_sel:-1,
  y_sel:-1,

  largeur_case: 70,
  hauteur_case: 35,

  offset_x: 0,
  offset_y: 0,

  context: undefined,
  canvas: undefined,

  run: function() {
    var self = this;

    this.canvas = document.getElementById('canvas_jeu');
    this.context = this.canvas.getContext("2d");

    this.nb_cases_largeur = this.carte.length;
    this.nb_cases_hauteur = this.carte[0].length;

    this.images[0] = new Image();
    this.images[0].src = '/corail-rouge-9.png';

    this.images[1] = new Image();
    this.images[1].src = '/corail-jaune-33.png';

    this.images[0].onload = function() { self.dessine_terrain(); }
    this.images[1].onload = function() { self.dessine_terrain(); }

    document.body.onmousemove = e => {
      var rect = this.canvas.getBoundingClientRect();
      var x = e.clientX - rect.left - self.offset_x - self.largeur_case/2;
      var y = e.clientY - rect.top - self.offset_y - self.hauteur_case/2;

      self.x_sel = Math.round(x / self.largeur_case - y / self.hauteur_case);
      self.y_sel = Math.round(x / self.largeur_case + y / self.hauteur_case);

      self.dessine_terrain();
   };

    window.addEventListener("click", function(event) {
      if (self.x_sel>=0 && self.x_sel<self.nb_cases_largeur && self.y_sel>=0 && self.y_sel<self.nb_cases_hauteur)
      {
        self.carte[self.x_sel][self.y_sel]+=1;
        if (self.carte[self.x_sel][self.y_sel]>self.images.length) self.carte[self.x_sel][self.y_sel]=0;

        self.dessine_terrain();
      }
    });

    this.on_resize();
    this.dessine_terrain();
  },

  on_resize: function() {
    this.offset_x = 10;
    this.offset_y = 300;
  },

  dessine_terrain: function() {
    this.context.canvas.width = this.context.canvas.width;

    for (var x=this.nb_cases_largeur-1 ; x>=0 ; x--)
    {
       for (var y=0; y <this.nb_cases_hauteur; y++) 
       {
          var contour = (x==this.x_sel && y==this.y_sel)?'red':'grey';
          this.dessine_case(x, y, this.carte[x][y], contour);
      }
    }
  },

  dessine_case: function(Xi, Yi, idx_image, color_contour) {
    var offX = Xi * this.largeur_case / 2 + Yi * this.largeur_case / 2 + this.offset_x;
    var offY = Yi * this.hauteur_case / 2 - Xi * this.hauteur_case / 2 + this.offset_y;

    var context = this.context;

    context.fillStyle = 'blue';
    context.strokeStyle = color_contour;

    if (color_contour=='red')
    {
       context.lineWidth = 5;
    }
    else
    {
       context.lineWidth = 1;
    }

    context.beginPath();
    context.moveTo(offX, offY + this.hauteur_case / 2);
    context.lineTo(offX + this.largeur_case / 2, offY);
    context.lineTo(offX + this.largeur_case / 2, offY);
    context.lineTo(offX + this.largeur_case, offY + this.hauteur_case / 2);
    context.lineTo(offX + this.largeur_case, offY + this.hauteur_case / 2);
    context.lineTo(offX + this.largeur_case / 2, offY + this.hauteur_case);
    context.lineTo(offX + this.largeur_case / 2, offY + this.hauteur_case);
    context.lineTo(offX, offY + this.hauteur_case / 2);
    context.closePath();
    context.fill();
    context.stroke();

    if (idx_image>=0 && idx_image<this.images.length)
    {
      this.context.drawImage(this.images[idx_image], offX+24-12, offY-10+5+1,60,40);
    }
  },

};

setTimeout(function(){ 
  Jeu.run();
}, 3000);

