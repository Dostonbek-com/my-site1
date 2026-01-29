   // Global Variables
        let currentUser = null;
        let comments = [
            {
                id: 1,
                name: "Sardorbek Karimov",
                avatar: "S",
                badge: "Frontend Dev",
                time: "2 soat oldin",
                text: "HTML5 haqida juda yaxshi tushuntirilgan! Flexbox va Grid bo'yicha ham qo'shimcha ma'lumot bersangiz yaxshi bo'lardi.",
                likes: 12,
                liked: false,
                replies: [
                    {
                        id: 11,
                        name: "Dilshod Rahimov",
                        avatar: "D",
                        badge: "Mentor",
                        time: "1 soat oldin",
                        text: "Rahmat! CSS bo'limida Grid haqida to'liq ma'lumot bor, albatta ko'rib chiqing.",
                        likes: 5,
                        liked: false
                    }
                ]
            },
            {
                id: 2,
                name: "Madina Azizova",
                avatar: "M",
                badge: "Junior Dev",
                time: "5 soat oldin",
                text: "JavaScript asoslari juda tushunarli yozilgan. Kalkulyator demo ayniqsa yoqdi! 👍",
                likes: 8,
                liked: false,
                replies: []
            },
            {
                id: 3,
                name: "Jasur Toshmatov",
                avatar: "J",
                badge: "Full Stack",
                time: "1 kun oldin",
                text: "Platforma dizayni ajoyib! React bo'limini kutmoqdamiz, qachon qo'shiladi?",
                likes: 15,
                liked: false,
                replies: []
            }
        ];

        // Auth Functions
        function switchAuthTab(tab) {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

            event.target.classList.add('active');
            document.getElementById(tab + 'Form').classList.add('active');
        }

        function handleLogin(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            // Simulate login
            const name = email.split('@')[0];
            currentUser = {
                name: name.charAt(0).toUpperCase() + name.slice(1),
                email: email,
                avatar: name.charAt(0).toUpperCase()
            };

            completeAuth();
        }

        function handleRegister(e) {
            e.preventDefault();
            const name = document.getElementById('regName').value;

            currentUser = {
                name: name,
                email: document.getElementById('regEmail').value,
                avatar: name.charAt(0).toUpperCase()
            };

            completeAuth();
        }

        function socialLogin(provider) {
            currentUser = {
                name: provider === 'google' ? 'Google User' : 'GitHub User',
                email: 'user@' + provider + '.com',
                avatar: provider === 'google' ? 'G' : 'GH'
            };
            completeAuth();
        }

        function completeAuth() {
            document.getElementById('authOverlay').classList.add('hidden');
            document.getElementById('userProfile').style.display = 'flex';
            document.getElementById('userName').textContent = currentUser.name;
            document.getElementById('userAvatar').textContent = currentUser.avatar;
            document.getElementById('commentAvatar').textContent = currentUser.avatar;

            showNotification('Xush kelibsiz, ' + currentUser.name + '!');
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }

        function logout() {
            currentUser = null;
            localStorage.removeItem('currentUser');
            document.getElementById('authOverlay').classList.remove('hidden');
            document.getElementById('userProfile').style.display = 'none';
            showNotification('Tizimdan chiqdingiz');
        }

        // Check for saved session
        window.addEventListener('load', () => {
            const saved = localStorage.getItem('currentUser');
            if (saved) {
                currentUser = JSON.parse(saved);
                document.getElementById('authOverlay').classList.add('hidden');
                document.getElementById('userProfile').style.display = 'flex';
                document.getElementById('userName').textContent = currentUser.name;
                document.getElementById('userAvatar').textContent = currentUser.avatar;
                document.getElementById('commentAvatar').textContent = currentUser.avatar;
            }

            renderComments();
            createParticles();
        });

        // Comment Functions
        function renderComments() {
            const list = document.getElementById('commentsList');
            list.innerHTML = '';

            comments.forEach(comment => {
                const commentEl = createCommentElement(comment);
                list.appendChild(commentEl);
            });

            document.getElementById('commentCount').textContent = comments.length;
        }

        function createCommentElement(comment, isReply = false) {
            const div = document.createElement('div');
            div.className = isReply ? 'comment reply' : 'comment';
            div.innerHTML = `
                <div class="comment-header">
                    <div class="comment-author">
                        <div class="comment-author-avatar">${comment.avatar}</div>
                        <div class="comment-meta">
                            <div class="comment-name">${comment.name}</div>
                            <div class="comment-time">${comment.time}</div>
                        </div>
                    </div>
                    ${comment.badge ? `<span class="comment-badge">${comment.badge}</span>` : ''}
                </div>
                <div class="comment-text">${comment.text}</div>
                <div class="comment-footer">
                    <button class="comment-like ${comment.liked ? 'liked' : ''}" onclick="toggleLike(${comment.id})">
                        <span>${comment.liked ? '❤️' : '🤍'}</span>
                        <span class="comment-likes-count">${comment.likes}</span>
                    </button>
                    <button class="comment-reply" onclick="toggleReplyForm(${comment.id})">
                        <span>💬</span> Javob yozish
                    </button>
                </div>
                <div class="reply-form" id="replyForm-${comment.id}">
                    <textarea class="comment-input" style="min-height: 80px; margin-bottom: 10px;" placeholder="Javobingizni yozing..."></textarea>
                    <button class="comment-btn" onclick="addReply(${comment.id})">Yuborish</button>
                </div>
                ${comment.replies && comment.replies.length > 0 ? `
                    <div class="replies">
                        ${comment.replies.map(reply => createCommentElement(reply, true).outerHTML).join('')}
                    </div>
                ` : ''}
            `;
            return div;
        }

        function addComment() {
            if (!currentUser) {
                showNotification('Izoh qoldirish uchun tizimga kiring!', true);
                document.getElementById('authOverlay').classList.remove('hidden');
                return;
            }

            const text = document.getElementById('commentText').value.trim();
            if (!text) {
                showNotification('Izoh matnini kiriting!', true);
                return;
            }

            const newComment = {
                id: Date.now(),
                name: currentUser.name,
                avatar: currentUser.avatar,
                badge: "Developer",
                time: "Hozirgina",
                text: text,
                likes: 0,
                liked: false,
                replies: []
            };

            comments.unshift(newComment);
            document.getElementById('commentText').value = '';
            renderComments();
            showNotification('Izohingiz qo\'shildi!');
        }

        function toggleLike(id) {
            const comment = findComment(id);
            if (comment) {
                comment.liked = !comment.liked;
                comment.likes += comment.liked ? 1 : -1;
                renderComments();
            }
        }

        function findComment(id, list = comments) {
            for (let c of list) {
                if (c.id === id) return c;
                if (c.replies) {
                    const found = findComment(id, c.replies);
                    if (found) return found;
                }
            }
            return null;
        }

        function toggleReplyForm(id) {
            const form = document.getElementById(`replyForm-${id}`);
            form.classList.toggle('active');
        }

        function addReply(parentId) {
            if (!currentUser) {
                showNotification('Javob yozish uchun tizimga kiring!', true);
                return;
            }

            const form = document.getElementById(`replyForm-${parentId}`);
            const text = form.querySelector('textarea').value.trim();

            if (!text) return;

            const parent = findComment(parentId);
            if (parent) {
                if (!parent.replies) parent.replies = [];
                parent.replies.push({
                    id: Date.now(),
                    name: currentUser.name,
                    avatar: currentUser.avatar,
                    time: "Hozirgina",
                    text: text,
                    likes: 0,
                    liked: false
                });
                renderComments();
                showNotification('Javob yuborildi!');
            }
        }

        // UI Functions
        function toggleCard(card) {
            const isExpanded = card.classList.contains('expanded');
            document.querySelectorAll('.card').forEach(c => c.classList.remove('expanded'));
            if (!isExpanded) {
                card.classList.add('expanded');
                setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 300);
            }
        }

        function showNotification(text, isError = false) {
            const notif = document.getElementById('notification');
            document.getElementById('notifText').textContent = text;
            notif.className = 'notification show' + (isError ? ' error' : '');
            setTimeout(() => notif.classList.remove('show'), 3000);
        }

        function copyCode(btn) {
            const code = btn.closest('.card-content').querySelector('pre').innerText;
            navigator.clipboard.writeText(code);
            btn.textContent = 'Nusxa olindi!';
            setTimeout(() => btn.textContent = 'Nusxa olish', 2000);
            showNotification('Kod nusxa olindi!');
        }

        function updateHtmlPreview() {
            const input = document.getElementById('htmlInput').value;
            const preview = document.getElementById('htmlPreview');
            preview.innerHTML = input || 'Natija shu yerda ko\'rinadi...';
        }

        function updateCssDemo() {
            const color = document.getElementById('colorPicker').value;
            const radius = document.getElementById('radiusSlider').value;
            const shadow = document.getElementById('shadowSelect').value;

            const box = document.getElementById('cssDemoBox');
            box.style.background = color;
            box.style.borderRadius = radius + 'px';

            let shadowStyle = '';
            if (shadow === 'small') shadowStyle = '0 4px 6px rgba(0,0,0,0.1)';
            else if (shadow === 'large') shadowStyle = '0 20px 40px rgba(0,0,0,0.3)';
            else if (shadow === 'neon') shadowStyle = `0 0 30px ${color}`;

            box.style.boxShadow = shadowStyle;
        }

        // Calculator
        let calcExpression = '';
        function calc(value) {
            const display = document.getElementById('calcDisplay');
            if (value === 'C') {
                calcExpression = '';
                display.textContent = '0';
            } else if (value === '=') {
                try {
                    calcExpression = eval(calcExpression).toString();
                    display.textContent = calcExpression;
                } catch {
                    display.textContent = 'Xato';
                    calcExpression = '';
                }
            } else {
                calcExpression += value;
                display.textContent = calcExpression;
            }
        }

        // Particles
        function createParticles() {
            const container = document.getElementById('particles');
            for (let i = 0; i < 50; i++) {
                const p = document.createElement('div');
                p.className = 'particle';
                p.style.left = Math.random() * 100 + '%';
                p.style.top = Math.random() * 100 + '%';
                p.style.animationDelay = Math.random() * 15 + 's';
                container.appendChild(p);
            }
        }