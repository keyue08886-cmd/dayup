// ============================================
// 英语打卡 - 主应用逻辑
// ============================================

// 应用状态
const App = {
    currentUser: null,
    currentPage: 'home',
    
    // 初始化
    init() {
        // 检查登录状态
        this.currentUser = UserService.getCurrentUser();
        
        // 初始化页面
        this.initPage();
        
        // 绑定事件
        this.bindEvents();
        
        // 更新UI
        this.updateUI();
    },
    
    // 初始化页面
    initPage() {
        const path = window.location.pathname;
        
        // 检查是否需要登录
        const publicPages = ['/login.html', '/'];
        const currentPage = path.split('/').pop() || 'index.html';
        
        if (!this.currentUser && !currentPage.includes('login')) {
            window.location.href = 'login.html';
            return;
        }
        
        // 检查管理员权限
        if (currentPage.includes('admin') && this.currentUser && !UserService.isAdmin(this.currentUser)) {
            window.location.href = 'index.html';
            return;
        }
    },
    
    // 绑定事件
    bindEvents() {
        // 用户下拉菜单
        const userToggle = document.querySelector('.navbar-user');
        const dropdown = document.querySelector('.navbar-dropdown');
        
        if (userToggle && dropdown) {
            userToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('show');
            });
            
            document.addEventListener('click', () => {
                dropdown.classList.remove('show');
            });
        }
        
        // 汉堡菜单
        const hamburger = document.querySelector('.hamburger');
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        if (hamburger && sidebar && overlay) {
            hamburger.addEventListener('click', () => {
                sidebar.classList.toggle('show');
                overlay.classList.toggle('show');
            });
            
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('show');
                overlay.classList.remove('show');
            });
        }
    },
    
    // 更新UI
    updateUI() {
        // 更新用户信息
        if (this.currentUser) {
            const avatarElements = document.querySelectorAll('.navbar-avatar, .user-avatar');
            avatarElements.forEach(el => {
                if (el) {
                    el.textContent = this.currentUser.nickname.charAt(0).toUpperCase();
                }
            });
            
            // 更新导航菜单（管理员显示管理后台入口）
            if (UserService.isAdmin(this.currentUser)) {
                const adminLinks = document.querySelectorAll('.admin-link');
                adminLinks.forEach(link => {
                    link.style.display = 'block';
                });
            }
        }
    },
    
    // 显示提示
    showToast(message, type = 'success') {
        // 移除已有的toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },
    
    // 显示加载
    showLoading(container) {
        container.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
            </div>
        `;
    },
    
    // 显示空状态
    showEmpty(container, message) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">📭</div>
                <p>${message}</p>
            </div>
        `;
    },
    
    // 格式化日期
    formatDate(dateStr) {
        const date = new Date(dateStr);
        const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${weekDays[date.getDay()]}`;
    },
    
    // 获取问候语
    getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return '早上好';
        if (hour < 18) return '下午好';
        return '晚上好';
    },
    
    // 退出登录
    logout() {
        UserService.logout();
        window.location.href = 'login.html';
    }
};

// ============================================
// 首页逻辑
// ============================================
const HomePage = {
    init() {
        if (!App.currentUser) return;
        
        this.renderWelcome();
        this.renderTodayContent();
        this.renderCheckinButton();
    },
    
    // 渲染欢迎区域
    renderWelcome() {
        const welcomeSection = document.querySelector('.welcome-section');
        if (!welcomeSection) return;
        
        welcomeSection.innerHTML = `
            <div class="welcome-text">
                <h2>${App.getGreeting()}，${App.currentUser.nickname}</h2>
                <p>${App.formatDate(getTodayString())}</p>
            </div>
            <div class="streak-badge">
                <span class="fire">🔥</span>
                <div>
                    <div class="count">${App.currentUser.continuousDays || 0}</div>
                    <div class="label">连续打卡天数</div>
                </div>
            </div>
        `;
    },
    
    // 渲染今日学习内容
    renderTodayContent() {
        const wordCard = document.querySelector('.word-card');
        const sentenceCard = document.querySelector('.sentence-card');
        
        if (!wordCard || !sentenceCard) return;
        
        const { word, sentence } = ContentService.getTodayContent();
        
        // 渲染单词卡片
        if (word) {
            wordCard.innerHTML = `
                <div class="word-header">
                    <span class="word-text">${word.content}</span>
                    <span class="word-phonetic">${word.phonetic}</span>
                    <button class="btn btn-sm btn-outline" onclick="HomePage.playSound('${word.content}')">🔊 发音</button>
                </div>
                <span class="word-pos">${word.meaning.split(' ')[0]}</span>
                <div class="word-meaning">${word.meaning.split(' ').slice(1).join(' ')}</div>
                <div class="word-example">
                    <div class="word-example-en">${word.example}</div>
                    <div class="word-example-cn">${word.exampleTranslation}</div>
                </div>
            `;
        }
        
        // 渲染句子卡片
        if (sentence) {
            sentenceCard.innerHTML = `
                <span class="sentence-label">每日一句</span>
                <div class="sentence-en">${sentence.content}</div>
                <div class="sentence-cn">${sentence.meaning}</div>
            `;
        }
    },
    
    // 播放发音
    playSound(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        } else {
            App.showToast('您的浏览器不支持语音功能', 'error');
        }
    },
    
    // 渲染打卡按钮
    renderCheckinButton() {
        const checkinSection = document.querySelector('.checkin-section');
        if (!checkinSection) return;
        
        const hasCheckedIn = CheckinService.hasCheckedInToday(App.currentUser.id);
        
        if (hasCheckedIn) {
            checkinSection.innerHTML = `
                <button class="btn btn-lg checked" disabled>
                    今日已打卡 ✓
                </button>
            `;
        } else {
            checkinSection.innerHTML = `
                <button class="btn btn-primary btn-lg checkin-btn" onclick="HomePage.checkIn()">
                    完成今日学习，去打卡 🎯
                </button>
            `;
        }
    },
    
    // 打卡
    checkIn() {
        if (!App.currentUser) return;
        
        const result = CheckinService.checkIn(App.currentUser.id);
        
        if (result.success) {
            // 更新用户数据
            App.currentUser = UserService.getById(App.currentUser.id);
            
            // 显示打卡成功动画
            this.showConfetti();
            
            // 更新UI
            this.renderWelcome();
            this.renderCheckinButton();
            
            App.showToast(`打卡成功！连续${result.data.continuousDays}天 🎉`, 'success');
        } else {
            App.showToast(result.message, 'error');
        }
    },
    
    // 显示彩带动画
    showConfetti() {
        const colors = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0'];
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti';
        document.body.appendChild(confettiContainer);
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: absolute;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -20px;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                animation: fall ${Math.random() * 3 + 2}s linear forwards;
            `;
            confettiContainer.appendChild(confetti);
        }
        
        // 添加动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fall {
                to {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => confettiContainer.remove(), 5000);
    }
};

// ============================================
// 排行榜页面逻辑
// ============================================
const RankPage = {
    init() {
        if (!App.currentUser) return;
        this.renderRanking();
    },
    
    renderRanking() {
        const podiumContainer = document.querySelector('.rank-podium');
        const listContainer = document.querySelector('.rank-list');
        
        if (!podiumContainer || !listContainer) return;
        
        const ranking = UserService.getRanking();
        
        if (ranking.length === 0) {
            App.showEmpty(listContainer, '暂无排行数据');
            return;
        }
        
        // 渲染前三名
        const top3 = ranking.slice(0, 3);
        const positions = ['first', 'second', 'third'];
        const crowns = ['👑', '', ''];
        
        podiumContainer.innerHTML = top3.map((user, index) => `
            <div class="podium-item ${positions[index]}">
                <div class="podium-avatar">
                    ${index === 0 ? '<span class="podium-crown">👑</span>' : ''}
                    <div class="avatar">${user.nickname.charAt(0).toUpperCase()}</div>
                </div>
                <div class="podium-name">${user.nickname}</div>
                <div class="podium-days">连续${user.continuousDays}天</div>
                <div class="podium-stand"></div>
            </div>
        `).join('');
        
        // 渲染排行榜列表
        listContainer.innerHTML = ranking.map((user, index) => `
            <li class="rank-item ${user.id === App.currentUser.id ? 'current-user' : ''}">
                <span class="rank-position">${index + 1}</span>
                <div class="rank-avatar">${user.nickname.charAt(0).toUpperCase()}</div>
                <div class="rank-info">
                    <div class="rank-name">${user.nickname}</div>
                    <div class="rank-dept">${user.department || '未设置部门'}</div>
                </div>
                <div class="rank-stats">
                    <div class="rank-continuous">${user.continuousDays}天</div>
                    <div class="rank-total">累计${user.totalDays}天</div>
                </div>
            </li>
        `).join('');
    }
};

// ============================================
// 统计页面逻辑
// ============================================
const StatsPage = {
    init() {
        if (!App.currentUser) return;
        
        this.renderStatsCards();
        this.renderHeatmap();
        this.renderTrendChart();
    },
    
    // 渲染统计卡片
    renderStatsCards() {
        const statsGrid = document.querySelector('.stats-grid');
        if (!statsGrid) return;
        
        // 计算本月打卡天数
        const now = new Date();
        const monthCheckins = CheckinService.getMonthCheckins(App.currentUser.id, now.getFullYear(), now.getMonth());
        
        statsGrid.innerHTML = `
            <div class="stat-card">
                <div class="stat-icon">🔥</div>
                <div class="stat-number">${App.currentUser.continuousDays || 0}</div>
                <div class="stat-label">连续打卡天数</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📊</div>
                <div class="stat-number">${App.currentUser.totalDays || 0}</div>
                <div class="stat-label">累计打卡天数</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📅</div>
                <div class="stat-number">${monthCheckins.length}</div>
                <div class="stat-label">本月打卡天数</div>
            </div>
        `;
    },
    
    // 渲染热力图
    renderHeatmap() {
        const container = document.querySelector('.heatmap-container');
        if (!container) return;
        
        const recentCheckins = CheckinService.getRecentCheckins(App.currentUser.id, 180);
        
        // 按周组织数据
        const weeks = [];
        let currentWeek = [];
        
        recentCheckins.forEach((day, index) => {
            const date = new Date(day.date);
            const dayOfWeek = date.getDay();
            
            // 如果是周日且不是第一天，开始新的一周
            if (dayOfWeek === 0 && index !== 0) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
            
            currentWeek.push(day);
        });
        
        if (currentWeek.length > 0) {
            weeks.push(currentWeek);
        }
        
        // 生成热力图HTML
        let html = '<div class="heatmap">';
        
        weeks.forEach(week => {
            html += '<div class="heatmap-week">';
            for (let i = 0; i < 7; i++) {
                const day = week[i];
                if (day) {
                    const level = day.checked ? 'level-2' : '';
                    html += `<div class="heatmap-day ${level}" title="${day.date}: ${day.checked ? '已打卡' : '未打卡'}"></div>`;
                } else {
                    html += '<div class="heatmap-day"></div>';
                }
            }
            html += '</div>';
        });
        
        html += '</div>';
        
        // 添加图例
        html += `
            <div class="heatmap-legend">
                <span>少</span>
                <div class="day" style="background: #ebedf0;"></div>
                <div class="day" style="background: #9be9a8;"></div>
                <div class="day" style="background: #40c463;"></div>
                <div class="day" style="background: #30a14e;"></div>
                <div class="day" style="background: #216e39;"></div>
                <span>多</span>
            </div>
        `;
        
        container.innerHTML = html;
    },
    
    // 渲染趋势图
    renderTrendChart() {
        const container = document.querySelector('.trend-chart');
        if (!container) return;
        
        const recentCheckins = CheckinService.getRecentCheckins(App.currentUser.id, 30);
        
        // 简单的SVG趋势图
        const width = container.clientWidth || 600;
        const height = 200;
        const padding = 30;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        
        // 生成路径
        const points = recentCheckins.map((day, index) => {
            const x = padding + (index / (recentCheckins.length - 1)) * chartWidth;
            const y = day.checked ? padding : height - padding;
            return `${x},${y}`;
        });
        
        container.innerHTML = `
            <svg viewBox="0 0 ${width} ${height}">
                <!-- 背景网格 -->
                <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="#eee" stroke-width="1"/>
                <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#eee" stroke-width="1"/>
                
                <!-- 打卡点 -->
                ${recentCheckins.map((day, index) => {
                    const x = padding + (index / (recentCheckins.length - 1)) * chartWidth;
                    const y = day.checked ? padding + 20 : height - padding - 20;
                    return `<circle cx="${x}" cy="${y}" r="4" fill="${day.checked ? '#4CAF50' : '#e0e0e0'}"/>`;
                }).join('')}
                
                <!-- Y轴标签 -->
                <text x="10" y="${padding + 20}" font-size="12" fill="#666">已打卡</text>
                <text x="10" y="${height - padding - 15}" font-size="12" fill="#666">未打卡</text>
            </svg>
        `;
    }
};

// ============================================
// 个人中心页面逻辑
// ============================================
const ProfilePage = {
    init() {
        if (!App.currentUser) return;
        
        this.renderUserInfo();
        this.bindEvents();
    },
    
    // 渲染用户信息
    renderUserInfo() {
        const userInfo = document.querySelector('.user-info-card');
        if (!userInfo) return;
        
        userInfo.innerHTML = `
            <div class="user-profile">
                <div class="avatar large">${App.currentUser.nickname.charAt(0).toUpperCase()}</div>
                <h2>${App.currentUser.nickname}</h2>
                <p>工号：${App.currentUser.workNo || '未设置'}</p>
                <p>部门：${App.currentUser.department || '未设置'}</p>
            </div>
        `;
    },
    
    // 绑定事件
    bindEvents() {
        const form = document.querySelector('.password-form');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const oldPassword = form.querySelector('[name="oldPassword"]').value;
            const newPassword = form.querySelector('[name="newPassword"]').value;
            const confirmPassword = form.querySelector('[name="confirmPassword"]').value;
            
            // 验证
            if (!oldPassword) {
                App.showToast('请输入原密码', 'error');
                return;
            }
            
            if (newPassword.length < 6 || newPassword.length > 20) {
                App.showToast('新密码长度应为6-20位', 'error');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                App.showToast('两次输入的密码不一致', 'error');
                return;
            }
            
            // 修改密码
            const result = UserService.changePassword(App.currentUser.id, oldPassword, newPassword);
            
            if (result.success) {
                App.showToast('密码修改成功', 'success');
                form.reset();
            } else {
                App.showToast(result.message, 'error');
            }
        });
    }
};

// ============================================
// 管理后台页面逻辑
// ============================================
const AdminPage = {
    init() {
        if (!App.currentUser || !UserService.isAdmin(App.currentUser)) {
            window.location.href = 'index.html';
            return;
        }
        
        this.renderUserList();
        this.bindEvents();
    },
    
    // 渲染用户列表
    renderUserList() {
        const tableBody = document.querySelector('.user-table tbody');
        if (!tableBody) return;
        
        const users = UserService.getAll().filter(u => u.username !== 'admin');
        
        if (users.length === 0) {
            App.showEmpty(tableBody, '暂无用户数据');
            return;
        }
        
        tableBody.innerHTML = users.map((user, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${user.username}</td>
                <td>${user.nickname}</td>
                <td>${user.department || '-'}</td>
                <td>${user.continuousDays || 0}天</td>
                <td>${user.totalDays || 0}天</td>
                <td class="actions">
                    <button class="btn btn-sm btn-outline" onclick="AdminPage.editUser('${user.id}')">编辑</button>
                    <button class="btn btn-sm btn-secondary" onclick="AdminPage.resetPassword('${user.id}')">重置密码</button>
                    <button class="btn btn-sm btn-danger" onclick="AdminPage.deleteUser('${user.id}')">删除</button>
                </td>
            </tr>
        `).join('');
    },
    
    // 绑定事件
    bindEvents() {
        // 搜索功能
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const keyword = e.target.value.toLowerCase();
                const rows = document.querySelectorAll('.user-table tbody tr');
                
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(keyword) ? '' : 'none';
                });
            });
        }
        
        // 添加用户按钮
        const addBtn = document.querySelector('.add-user-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showUserModal());
        }
    },
    
    // 显示用户弹窗
    showUserModal(user = null) {
        const modal = document.querySelector('.user-modal');
        const title = modal.querySelector('.modal-title');
        const form = modal.querySelector('form');
        
        title.textContent = user ? '编辑用户' : '添加用户';
        
        if (user) {
            form.querySelector('[name="id"]').value = user.id;
            form.querySelector('[name="username"]').value = user.username;
            form.querySelector('[name="nickname"]').value = user.nickname;
            form.querySelector('[name="workNo"]').value = user.workNo || '';
            form.querySelector('[name="department"]').value = user.department || '';
            form.querySelector('[name="password"]').value = '';
            form.querySelector('[name="password"]').placeholder = '留空则不修改';
        } else {
            form.reset();
            form.querySelector('[name="id"]').value = '';
        }
        
        modal.classList.add('show');
    },
    
    // 隐藏用户弹窗
    hideUserModal() {
        document.querySelector('.user-modal').classList.remove('show');
    },
    
    // 保存用户
    saveUser() {
        const form = document.querySelector('.user-modal form');
        const formData = new FormData(form);
        
        const userData = {
            username: formData.get('username'),
            nickname: formData.get('nickname'),
            workNo: formData.get('workNo'),
            department: formData.get('department'),
            password: formData.get('password')
        };
        
        const id = formData.get('id');
        
        let result;
        if (id) {
            // 编辑
            result = UserService.update(id, userData);
        } else {
            // 添加
            if (!userData.password) {
                userData.password = '123456';
            }
            result = UserService.add(userData);
        }
        
        if (result.success) {
            App.showToast(id ? '用户更新成功' : '用户添加成功', 'success');
            this.hideUserModal();
            this.renderUserList();
        } else {
            App.showToast(result.message, 'error');
        }
    },
    
    // 编辑用户
    editUser(id) {
        const user = UserService.getById(id);
        if (user) {
            this.showUserModal(user);
        }
    },
    
    // 重置密码
    resetPassword(id) {
        if (confirm('确定要重置该用户的密码为123456吗？')) {
            const result = UserService.resetPassword(id);
            if (result.success) {
                App.showToast('密码已重置为123456', 'success');
            } else {
                App.showToast(result.message, 'error');
            }
        }
    },
    
    // 删除用户
    deleteUser(id) {
        if (confirm('确定要删除该用户吗？此操作不可恢复。')) {
            const result = UserService.delete(id);
            if (result.success) {
                App.showToast('用户已删除', 'success');
                this.renderUserList();
            } else {
                App.showToast(result.message, 'error');
            }
        }
    }
};

// ============================================
// 登录页面逻辑
// ============================================
const LoginPage = {
    init() {
        // 如果已登录，跳转到首页
        if (App.currentUser) {
            window.location.href = 'index.html';
            return;
        }
        
        this.bindEvents();
    },
    
    bindEvents() {
        const form = document.querySelector('.login-form');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = form.querySelector('[name="username"]').value;
            const password = form.querySelector('[name="password"]').value;
            
            if (!username || !password) {
                App.showToast('请输入用户名和密码', 'error');
                return;
            }
            
            const result = UserService.login(username, password);
            
            if (result.success) {
                App.showToast('登录成功', 'success');
                setTimeout(() => {
                    // 管理员跳转到管理后台，普通用户跳转到首页
                    if (UserService.isAdmin(result.user)) {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                }, 500);
            } else {
                App.showToast(result.message, 'error');
            }
        });
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    App.init();
    
    // 根据页面执行不同初始化
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    
    switch (page) {
        case 'index.html':
        case '':
            HomePage.init();
            break;
        case 'rank.html':
            RankPage.init();
            break;
        case 'stats.html':
            StatsPage.init();
            break;
        case 'profile.html':
            ProfilePage.init();
            break;
        case 'admin.html':
            AdminPage.init();
            break;
        case 'login.html':
            LoginPage.init();
            break;
    }
});