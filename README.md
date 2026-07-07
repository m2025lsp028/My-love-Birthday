# 🎂 Birthday Website

A personalized, animated birthday website — photo slideshow, floating hearts,
confetti, sweet messages, and optional music. Built as a gift for someone special. 💝

## 📁 What's inside
```
birthday-site/
├── index.html      ← the page (edit name, messages & photo list here)
├── style.css       ← colors & styling (change the theme here)
├── script.js       ← animations (no need to edit)
├── images/         ← put her photos here (photo1.jpg, photo2.jpg, ...)
└── music/          ← optional: put song.mp3 here for background music
```

## ✏️ How to personalize (3 quick steps)

1. **Her name** — in `index.html`, near the top, change:
   ```html
   <div id="config" data-name="My Love" ...>
   ```
   Replace `My Love` with her name or your nickname for her.

2. **Add photos** — drop images into the `images/` folder named
   `photo1.jpg`, `photo2.jpg`, `photo3.jpg`. Add more by copying a
   `<div class="slide">…</div>` block (look for the "ADD PHOTOS" comment).

3. **Edit the messages** — in `index.html`, change the text in the
   intro message, the "Reasons I love you" list, and the birthday wish.
   (Look for the `✏️ CUSTOMIZE` comments.)

Optional:
- **Music** — put an mp3 at `music/song.mp3`, then tap the 🔇 button on the page.
- **Colors** — change the `:root` color values at the top of `style.css`.

## 👀 Preview it locally
From inside the `birthday-site` folder:
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000 in your browser.

## 🌐 Share it with her (free hosting)
Any of these work great for a link you can text her:
- **Netlify Drop** — drag the `birthday-site` folder onto https://app.netlify.com/drop
- **GitHub Pages** — push the folder to a repo and enable Pages
- **Vercel** — import the folder and deploy

That's it — enjoy, and happy birthday to her! 🎉
