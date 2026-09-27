from pathlib import Path

readme = r'''<div align="center">

# VOID SURVIVOR

### OUTLIVE THE VOID.

A fast-paced browser survival roguelite built by **Nguyen Khang**.

<br>

[![Play in Browser](https://img.shields.io/badge/PLAY-BROWSER-1769ff?style=for-the-badge)](#play-the-game)
[![HTML5](https://img.shields.io/badge/HTML5-HTML%20%2F%20CSS%20%2F%20JS-e34f26?style=for-the-badge&logo=html5&logoColor=white)](#built-for-the-browser)
[![License](https://img.shields.io/badge/LICENSE-PROPRIETARY-111827?style=for-the-badge)](#license)

<br>

**Survive. Build. Adapt. Repeat.**

<br>

**[English](#english) · [Tiếng Việt](#tiếng-việt)**

</div>

---

<a id="english"></a>

# English

## What is Void Survivor?

**Void Survivor** is a browser-based survival roguelite built around fast movement, automatic combat, build experimentation, and increasingly chaotic encounters.

You control your survivor while attacks fire automatically. Every level forces a decision: strengthen an existing weapon, add a passive, reroll the available choices, or skip the upgrade and invest in the run differently.

As the timer climbs, ordinary enemies give way to elites, special encounters, world events, allies, and boss fights.

The goal is simple:

> **Stay alive while the Void keeps getting worse.**

If you enjoy experimenting with builds, stacking upgrades, reacting to unexpected events, and trying to survive increasingly aggressive waves, that is the core of Void Survivor.

---

## Core Gameplay

- **Automatic combat** - focus on movement, positioning, timing, and build decisions.
- **Large build system** - combine weapons, passives, defensive systems, summons, and special effects.
- **Up to 10 Weapon + 10 Passive slots** per run.
- **Level-up choices** with rerolls and skip mechanics.
- **Character-specific identities and abilities** that change how each run feels.
- **Allies and summons** that can fight alongside the player.
- **Elites, bosses, special encounters, and world events** that interrupt normal survival loops.
- **Shops, collections, unlocks, and progression systems** beyond a single run.
- **English / Vietnamese interface support** across the game systems.
- **Runs directly in a modern browser** - no game engine installation required.

---

## Controls

| Action | Key |
|---|---|
| Move | `WASD` / Arrow Keys |
| Attack | Automatic |
| Pause | `ESC` / `P` |
| Level-up choice | `1` / `2` / `3` |
| Skip upgrade | `Q` |
| Reroll choices | `E` |
| Mute / Unmute | `M` |
| Confirm / Continue | `SPACE` |

---

## Build System

A run is not about finding one fixed "correct" loadout.

Void Survivor is designed around stacking systems together and seeing what survives.

Weapons can include:

- Rapid projectiles
- Area attacks
- Chain damage
- Crowd control
- Summons
- Defensive tools
- Explosives
- Melee-style effects
- Homing attacks
- Other special weapon behaviors

Passive upgrades can affect:

- Damage
- Attack speed
- Movement
- Critical stats
- Survivability
- Healing
- XP economy
- Ally strength
- Defensive mechanics
- Risk / reward builds

Some combinations are safe.

Some are ridiculous.

That is part of the point.

---

## Encounters Beyond Normal Waves

The Void is not only an endless stream of enemies.

During a run, you may encounter:

- Boss cycles
- Elite threats
- Character encounters
- Side events
- World events
- Minigames
- Ally interactions
- Special objectives
- Reward opportunities

These systems are designed to break up the normal survival loop and force the player to react instead of simply holding one direction forever.

---

<a id="built-for-the-browser"></a>

## Built for the Browser

Void Survivor is written as a standalone web game using:

- **HTML5** for the game shell and UI structure
- **CSS** for HUD, menus, responsive layouts, visual effects, and presentation
- **Vanilla JavaScript** for gameplay, entities, weapons, enemies, progression, events, settings, and runtime systems
- **Canvas** for the main game rendering

The GitHub version separates the original single-file build into a cleaner source structure while preserving its original loading and execution order as closely as possible.

---

## Project Structure

```text
void-survivor-github/
├── index.html
├── PLAY_GAME.bat
│
├── css/
├── js/
│
├── legacy/
│   └── VOID_SURVIVOR_V14_MONOLITH.html
│
├── README.md
├── LICENSE
├── SOURCE_MAP.md
├── source-map.json
└── .gitignore
```

### What each part does

| Path | Purpose |
|---|---|
| `index.html` | Main game entry point |
| `PLAY_GAME.bat` | Quick Windows launcher |
| `css/` | Extracted style blocks |
| `js/` | Extracted JavaScript blocks |
| `legacy/` | Original monolithic build for reference |
| `SOURCE_MAP.md` | Maps original blocks to extracted files |
| `source-map.json` | Machine-readable source map |
| `LICENSE` | Nguyen Khang Proprietary License |

---

<a id="play-the-game"></a>

## Play the Game

### Option 1 - Windows

This is the easiest method.

1. Download this repository as a ZIP.
2. Extract the ZIP to a normal folder.
3. Open the extracted project folder.
4. Double-click:

```text
PLAY_GAME.bat
```

The game should open in your default browser.

You can also open:

```text
index.html
```

directly.

### Option 2 - Local server

Use this if your browser restricts a feature when opening `index.html` directly.

Open Terminal or Command Prompt inside the project folder and run:

```bash
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

> Python is only required for this optional local-server method. It is not required if `PLAY_GAME.bat` or `index.html` already works normally.

---

## Put the Game on GitHub

### Method A - GitHub website

This is the simplest method if you do not want to use Git commands.

1. Sign in to GitHub.
2. Click **New repository**.
3. Enter a repository name, for example:

```text
void-survivor
```

4. Choose **Public** or **Private**.
5. Do not create another README, `.gitignore`, or license if this project already contains them.
6. Click **Create repository**.
7. On the empty repository page, choose **uploading an existing file**.
8. Open the extracted project folder on your computer.
9. Upload the contents of the folder, including:

```text
index.html
PLAY_GAME.bat
css/
js/
legacy/
README.md
LICENSE
SOURCE_MAP.md
source-map.json
.gitignore
```

10. Enter a commit message such as:

```text
Initial release of Void Survivor
```

11. Click **Commit changes**.

Your source code is now on GitHub.

---

## Publish with GitHub Pages

Because Void Survivor is a static browser project, it can be hosted directly with GitHub Pages.

After uploading the project:

1. Open the GitHub repository.
2. Go to **Settings**.
3. Open **Pages**.
4. Under **Build and deployment**, choose:

```text
Source: Deploy from a branch
```

5. Select your main branch, normally:

```text
main
```

6. Select:

```text
/ (root)
```

7. Click **Save**.
8. Wait for GitHub Pages to provide the public URL.

Because `index.html` is already in the repository root, it acts as the website entry point.

---

## Git Method - Optional

If you prefer Git commands, open a terminal inside the project folder and run:

```bash
git init
git add .
git commit -m "Initial release of Void Survivor"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/void-survivor.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

---

## Editing the Game

The original build is patch-heavy, so the extracted files retain their original loading and execution order.

Use:

- Game page / markup -> `index.html`
- Visual styling -> `css/`
- Game logic and systems -> `js/`
- Original all-in-one reference build -> `legacy/VOID_SURVIVOR_V14_MONOLITH.html`

The numeric prefixes on CSS and JavaScript filenames represent their original source order.

> Avoid randomly changing the loading order unless you are intentionally refactoring dependencies.

---

## Build Notes

The repository was created by externalizing the original monolithic game while preserving its behavior as closely as possible.

Current source split:

- **73 CSS blocks** extracted
- **88 JavaScript blocks** extracted
- JavaScript loading order preserved
- CSS loading order preserved
- Original monolithic build retained in `legacy/` as a fallback and reference copy

No compilation or game-engine build process is required for normal play.

---

## About the Creator

### Nguyen Khang

I am a **Marketing and Public Relations student** interested in the space where communication, design, technology, automation, and interactive experiences overlap.

Alongside my studies at **Van Lang University** and **Centria University of Applied Sciences**, I work on projects involving visual design, workflow automation, web experiments, and tools that turn ideas into things people can actually interact with.

**Void Survivor** started as a browser-game experiment and gradually grew into a larger system of characters, weapons, passives, enemies, allies, events, bosses, progression mechanics, and UI layers.

<div align="center">

### Connect with me

[![GitHub](https://img.shields.io/badge/GitHub-khangkhangkhan--g-181717?style=for-the-badge&logo=github)](https://github.com/khangkhangkhan-g)
[![Facebook](https://img.shields.io/badge/Facebook-Nguyen%20Khang-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](https://www.facebook.com/ngkph.m/)
[![Instagram](https://img.shields.io/badge/Instagram-@ngkpham-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/ngkpham/)
[![Email](https://img.shields.io/badge/Email-nguyenkhangpham1306%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:nguyenkhangpham1306@gmail.com)

</div>

---

<a id="license"></a>

## License

**Copyright © 2026 Nguyen Khang. All Rights Reserved.**

Void Survivor is distributed under the **Nguyen Khang Proprietary License** included in [`LICENSE`](./LICENSE).

You may download, run, inspect, and privately modify this project for personal, non-commercial purposes.

The following require prior written permission from **Nguyen Khang**:

- Redistribution
- Republication
- Commercial use
- Sublicensing
- Claiming authorship
- Publishing derivative versions

Third-party names, likenesses, trademarks, characters, brands, or other referenced intellectual property, if present, remain the property of their respective owners.

The project license applies only to material for which Nguyen Khang holds the relevant rights.

---

<div align="center">

### A GAME BY KH4NG

**VOID SURVIVOR · 2026**

Built to see how far a browser game can be pushed before the Void wins.

</div>

---

<a id="tiếng-việt"></a>

# Tiếng Việt

## Void Survivor là gì?

**Void Survivor** là game survival roguelite chạy trực tiếp trên trình duyệt, tập trung vào di chuyển nhanh, chiến đấu tự động, thử nghiệm build và những đợt chiến đấu ngày càng hỗn loạn.

Người chơi điều khiển nhân vật trong khi hệ thống tấn công hoạt động tự động. Mỗi lần lên cấp buộc bạn phải đưa ra lựa chọn: nâng cấp vũ khí hiện có, thêm passive mới, reroll lựa chọn hoặc bỏ qua nâng cấp để đầu tư theo hướng khác.

Càng sống lâu, các đợt quái thông thường sẽ dần nhường chỗ cho elite, encounter đặc biệt, world event, đồng minh và boss.

Mục tiêu rất đơn giản:

> **Sống sót khi Void ngày càng trở nên tồi tệ hơn.**

Nếu bạn thích thử nghiệm nhiều kiểu build, stack upgrade, phản ứng với các sự kiện bất ngờ và cố sống sót trước những đợt quái ngày càng áp đảo, đó chính là gameplay cốt lõi của Void Survivor.

---

## Gameplay cốt lõi

- **Chiến đấu tự động** - tập trung vào di chuyển, positioning, timing và quyết định build.
- **Hệ thống build lớn** - kết hợp vũ khí, passive, phòng thủ, summon và hiệu ứng đặc biệt.
- **Tối đa 10 ô Weapon + 10 ô Passive** trong mỗi run.
- **Lựa chọn khi lên cấp** kèm reroll và skip.
- **Nhân vật có identity và ability riêng**, làm mỗi run có cảm giác khác nhau.
- **Ally và summon** có thể chiến đấu cùng người chơi.
- **Elite, boss, special encounter và world event** làm gián đoạn survival loop thông thường.
- **Shop, collection, unlock và progression system** vượt ra ngoài một run đơn lẻ.
- Hỗ trợ giao diện **English / Tiếng Việt**.
- **Chạy trực tiếp trên trình duyệt hiện đại** - không cần cài game engine.

---

## Điều khiển

| Hành động | Phím |
|---|---|
| Di chuyển | `WASD` / Phím mũi tên |
| Tấn công | Tự động |
| Tạm dừng | `ESC` / `P` |
| Chọn nâng cấp | `1` / `2` / `3` |
| Bỏ qua nâng cấp | `Q` |
| Reroll lựa chọn | `E` |
| Tắt / bật âm thanh | `M` |
| Xác nhận / Tiếp tục | `SPACE` |

---

## Hệ thống build

Một run không được thiết kế xoay quanh việc tìm một loadout "đúng duy nhất".

Void Survivor khuyến khích người chơi stack nhiều hệ thống với nhau và xem build nào có thể sống sót.

Vũ khí có thể bao gồm:

- Đạn tốc độ cao
- Tấn công diện rộng
- Chain damage
- Crowd control
- Summon
- Công cụ phòng thủ
- Explosive
- Hiệu ứng cận chiến
- Homing attack
- Các cơ chế vũ khí đặc biệt khác

Passive có thể tăng hoặc thay đổi:

- Damage
- Attack speed
- Movement
- Critical stats
- Survivability
- Healing
- XP economy
- Ally strength
- Defensive mechanics
- Risk / reward build

Một số combination khá an toàn.

Một số khác cực kỳ hỗn loạn.

Đó chính là một phần của trải nghiệm.

---

## Encounter ngoài những đợt quái thông thường

Void không chỉ là một dòng quái xuất hiện vô tận.

Trong một run, người chơi có thể gặp:

- Boss cycle
- Elite threat
- Character encounter
- Side event
- World event
- Minigame
- Ally interaction
- Special objective
- Reward opportunity

Các hệ thống này được thiết kế để phá vỡ survival loop thông thường và buộc người chơi phải phản ứng thay vì chỉ giữ một hướng di chuyển mãi.

---

## Chạy trực tiếp trên trình duyệt

Void Survivor được xây dựng như một web game độc lập bằng:

- **HTML5** cho game shell và cấu trúc UI
- **CSS** cho HUD, menu, responsive layout, visual effect và presentation
- **Vanilla JavaScript** cho gameplay, entity, weapon, enemy, progression, event, settings và runtime systems
- **Canvas** để render gameplay chính

Phiên bản GitHub tách bản game single-file ban đầu thành cấu trúc source rõ ràng hơn nhưng vẫn cố gắng giữ nguyên thứ tự load và execution của bản gốc.

---

## Cấu trúc project

```text
void-survivor-github/
├── index.html
├── PLAY_GAME.bat
│
├── css/
├── js/
│
├── legacy/
│   └── VOID_SURVIVOR_V14_MONOLITH.html
│
├── README.md
├── LICENSE
├── SOURCE_MAP.md
├── source-map.json
└── .gitignore
```

### Chức năng của từng phần

| Đường dẫn | Chức năng |
|---|---|
| `index.html` | File chạy game chính |
| `PLAY_GAME.bat` | Launcher nhanh trên Windows |
| `css/` | Các block CSS đã được tách |
| `js/` | Các block JavaScript đã được tách |
| `legacy/` | Bản monolithic gốc để tham chiếu |
| `SOURCE_MAP.md` | Mapping block gốc sang file đã tách |
| `source-map.json` | Source map dạng machine-readable |
| `LICENSE` | Nguyen Khang Proprietary License |

---

## Cách chơi

### Cách 1 - Windows

Đây là cách đơn giản nhất.

1. Tải repository dưới dạng ZIP.
2. Giải nén ZIP ra một folder bình thường.
3. Mở folder project.
4. Double-click:

```text
PLAY_GAME.bat
```

Game sẽ mở bằng trình duyệt mặc định.

Bạn cũng có thể mở trực tiếp:

```text
index.html
```

### Cách 2 - Chạy bằng local server

Dùng cách này nếu trình duyệt hạn chế một số tính năng khi mở trực tiếp `index.html`.

Mở Terminal hoặc Command Prompt trong folder project và chạy:

```bash
python -m http.server 8080
```

Sau đó mở:

```text
http://localhost:8080
```

> Python chỉ cần cho phương án local server tùy chọn này. Nếu `PLAY_GAME.bat` hoặc `index.html` hoạt động bình thường thì không cần Python.

---

## Đưa game lên GitHub

### Cách A - Upload bằng website GitHub

Đây là cách đơn giản nhất nếu bạn không muốn dùng Git command.

1. Đăng nhập GitHub.
2. Bấm **New repository**.
3. Đặt tên repository, ví dụ:

```text
void-survivor
```

4. Chọn **Public** hoặc **Private**.
5. Không tạo thêm README, `.gitignore` hoặc license nếu project đã có sẵn.
6. Bấm **Create repository**.
7. Trong repository trống, chọn **uploading an existing file**.
8. Mở folder project đã giải nén trên máy.
9. Upload toàn bộ nội dung bên trong folder:

```text
index.html
PLAY_GAME.bat
css/
js/
legacy/
README.md
LICENSE
SOURCE_MAP.md
source-map.json
.gitignore
```

10. Nhập commit message, ví dụ:

```text
Initial release of Void Survivor
```

11. Bấm **Commit changes**.

Source code của game lúc này đã nằm trên GitHub.

---

## Publish game bằng GitHub Pages

Void Survivor là project static nên có thể host trực tiếp bằng GitHub Pages.

Sau khi upload project:

1. Mở repository.
2. Vào **Settings**.
3. Chọn **Pages**.
4. Trong **Build and deployment**, chọn:

```text
Source: Deploy from a branch
```

5. Chọn branch chính, thường là:

```text
main
```

6. Chọn folder:

```text
/ (root)
```

7. Bấm **Save**.
8. Chờ GitHub Pages cung cấp public URL.

Vì `index.html` đã nằm ở root repository nên nó được dùng làm entry point của website.

---

## Dùng Git command - tùy chọn

Nếu muốn upload bằng Git, mở terminal trong folder project và chạy:

```bash
git init
git add .
git commit -m "Initial release of Void Survivor"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/void-survivor.git
git push -u origin main
```

Thay `YOUR-USERNAME` bằng username GitHub của bạn.

---

## Chỉnh sửa game

Bản game gốc có khá nhiều patch phụ thuộc thứ tự load, vì vậy các file đã tách vẫn giữ execution order ban đầu.

Dùng:

- Markup / game page -> `index.html`
- Visual styling -> `css/`
- Game logic và system -> `js/`
- Bản all-in-one gốc -> `legacy/VOID_SURVIVOR_V14_MONOLITH.html`

Prefix số trong tên file CSS và JavaScript đại diện cho thứ tự nguồn ban đầu.

> Không nên đổi ngẫu nhiên thứ tự load nếu bạn chưa chủ động refactor dependencies.

---

## Ghi chú build

Repository này được tạo bằng cách tách bản monolithic ban đầu thành nhiều file trong khi cố giữ hành vi của game gần với bản gốc nhất có thể.

Cấu trúc hiện tại:

- **73 CSS block** đã được tách
- **88 JavaScript block** đã được tách
- Giữ nguyên thứ tự load JavaScript
- Giữ nguyên thứ tự load CSS
- Bản monolithic gốc vẫn nằm trong `legacy/` để fallback và tham chiếu

Game không yêu cầu compile hoặc game-engine build process để chơi bình thường.

---

## Về nhà phát triển

### Nguyen Khang

Tôi là sinh viên **Marketing và Quan hệ Công chúng**, quan tâm đến giao điểm giữa truyền thông, thiết kế, công nghệ, automation và các trải nghiệm tương tác.

Bên cạnh việc học tại **Van Lang University** và **Centria University of Applied Sciences**, tôi thực hiện các project liên quan đến visual design, workflow automation, web experiment và những công cụ biến ý tưởng thành sản phẩm mà người khác có thể trực tiếp tương tác.

**Void Survivor** bắt đầu như một thử nghiệm browser game và dần phát triển thành một hệ thống lớn hơn với nhân vật, vũ khí, passive, enemy, ally, event, boss, progression mechanic và nhiều lớp UI.

<div align="center">

### Kết nối với tôi

[![GitHub](https://img.shields.io/badge/GitHub-khangkhangkhan--g-181717?style=for-the-badge&logo=github)](https://github.com/khangkhangkhan-g)
[![Facebook](https://img.shields.io/badge/Facebook-Nguyen%20Khang-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](https://www.facebook.com/ngkph.m/)
[![Instagram](https://img.shields.io/badge/Instagram-@ngkpham-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/ngkpham/)
[![Email](https://img.shields.io/badge/Email-nguyenkhangpham1306%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:nguyenkhangpham1306@gmail.com)

</div>

---

## Giấy phép

**Copyright © 2026 Nguyen Khang. All Rights Reserved.**

Void Survivor được phân phối theo **Nguyen Khang Proprietary License** nằm trong file [`LICENSE`](./LICENSE).

Bạn có thể tải, chạy, kiểm tra và chỉnh sửa project riêng tư cho mục đích cá nhân, phi thương mại.

Các hành động sau yêu cầu có sự cho phép bằng văn bản từ **Nguyen Khang**:

- Phân phối lại
- Đăng lại project
- Sử dụng thương mại
- Cấp lại quyền sử dụng
- Nhận mình là tác giả
- Công khai các phiên bản derivative

Tên, hình ảnh, trademark, character, brand hoặc tài sản trí tuệ của bên thứ ba, nếu có, vẫn thuộc quyền sở hữu của các chủ thể tương ứng.

License của project chỉ áp dụng cho những nội dung mà Nguyen Khang có quyền hợp pháp liên quan.

---

<div align="center">

### A GAME BY KH4NG

**VOID SURVIVOR · 2026**

Được tạo ra để xem một browser game có thể bị đẩy xa tới đâu trước khi Void chiến thắng.

</div>
'''

out = Path("/mnt/data/README_VOID_SURVIVOR_BILINGUAL.md")
out.write_text(readme, encoding="utf-8")
print(f"Created: {out}")
