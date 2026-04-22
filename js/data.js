// ============================================
// 英语打卡 - 数据管理
// ============================================

// 存储键名
const STORAGE_KEYS = {
    USERS: 'english_checkin_users',
    CHECKINS: 'english_checkin_checkins',
    CONTENTS: 'english_checkin_contents',
    CURRENT_USER: 'english_checkin_current_user',
    ADMINS: 'english_checkin_admins'
};

// 默认管理员工号
const DEFAULT_ADMINS = ['admin', '001'];

// 初始化默认数据
function initializeDefaultData() {
    // 初始化用户
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        const defaultUsers = [
            {
                id: '1',
                workNo: 'admin',
                username: 'admin',
                password: 'admin123',
                nickname: '管理员',
                department: '系统管理员',
                avatarUrl: '',
                continuousDays: 15,
                totalDays: 45,
                lastCheckIn: getTodayString(),
                createdAt: '2024-01-01'
            },
            {
                id: '2',
                workNo: '001',
                username: 'zhangsan',
                password: '123456',
                nickname: '张三',
                department: '技术部',
                avatarUrl: '',
                continuousDays: 30,
                totalDays: 60,
                lastCheckIn: getTodayString(),
                createdAt: '2024-01-01'
            },
            {
                id: '3',
                workNo: '002',
                username: 'lisi',
                password: '123456',
                nickname: '李四',
                department: '产品部',
                avatarUrl: '',
                continuousDays: 28,
                totalDays: 55,
                lastCheckIn: getYesterdayString(),
                createdAt: '2024-01-02'
            },
            {
                id: '4',
                workNo: '003',
                username: 'wangwu',
                password: '123456',
                nickname: '王五',
                department: '设计部',
                avatarUrl: '',
                continuousDays: 25,
                totalDays: 50,
                lastCheckIn: getTodayString(),
                createdAt: '2024-01-03'
            },
            {
                id: '5',
                workNo: '004',
                username: 'zhaoliu',
                password: '123456',
                nickname: '赵六',
                department: '运营部',
                avatarUrl: '',
                continuousDays: 20,
                totalDays: 40,
                lastCheckIn: getTodayString(),
                createdAt: '2024-01-04'
            }
        ];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
    }
    
    // 初始化管理员
    if (!localStorage.getItem(STORAGE_KEYS.ADMINS)) {
        localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(DEFAULT_ADMINS));
    }
    
    // 初始化学习内容
    if (!localStorage.getItem(STORAGE_KEYS.CONTENTS)) {
        const defaultContents = generateDefaultContents();
        localStorage.setItem(STORAGE_KEYS.CONTENTS, JSON.stringify(defaultContents));
    }
    
    // 初始化打卡记录
    if (!localStorage.getItem(STORAGE_KEYS.CHECKINS)) {
        const defaultCheckins = generateDefaultCheckins();
        localStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(defaultCheckins));
    }
}

// 生成默认学习内容
function generateDefaultContents() {
    const words = [
        { word: 'serendipity', phonetic: '/ˌserənˈdɪpəti/', pos: 'n.', meaning: '意外发现珍奇事物的本领', example: 'Finding that rare book was pure serendipity.', exampleCn: '找到那本珍本书纯属意外之喜。' },
        { word: 'ephemeral', phonetic: '/ɪˈfemərəl/', pos: 'adj.', meaning: '短暂的，转瞬即逝的', example: 'Fame is ephemeral in the entertainment industry.', exampleCn: '在娱乐圈，名气是短暂的。' },
        { word: 'resilience', phonetic: '/rɪˈzɪliəns/', pos: 'n.', meaning: '恢复力，适应力', example: 'Her resilience helped her overcome many challenges.', exampleCn: '她的适应力帮助她克服了许多挑战。' },
        { word: 'ubiquitous', phonetic: '/juːˈbɪkwɪtəs/', pos: 'adj.', meaning: '无处不在的，普遍存在的', example: 'Smartphones have become ubiquitous in modern life.', exampleCn: '智能手机在现代生活中无处不在。' },
        { word: 'eloquent', phonetic: '/ˈeləkwənt/', pos: 'adj.', meaning: '雄辩的，有说服力的', example: 'She gave an eloquent speech on environmental protection.', exampleCn: '她就环境保护发表了雄辩的演讲。' },
        { word: 'pragmatic', phonetic: '/præɡˈmætɪk/', pos: 'adj.', meaning: '务实的，实用主义的', example: 'We need a pragmatic approach to solve this problem.', exampleCn: '我们需要务实的方法来解决这个问题。' },
        { word: 'meticulous', phonetic: '/məˈtɪkjələs/', pos: 'adj.', meaning: '一丝不苟的，谨小慎微的', example: 'He is meticulous in his research work.', exampleCn: '他在研究工作中一丝不苟。' },
        { word: 'paradigm', phonetic: '/ˈpærədaɪm/', pos: 'n.', meaning: '范例，典范', example: 'This represents a paradigm shift in thinking.', exampleCn: '这代表了思维方式的范式转变。' }
    ];
    
    const sentences = [
        { en: 'The only way to do great work is to love what you do.', cn: '成就伟大工作的唯一途径是热爱你所做的事。' },
        { en: 'In the middle of difficulty lies opportunity.', cn: '困难之中蕴含着机遇。' },
        { en: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', cn: '成功不是终点，失败也不是致命的，重要的是继续前进的勇气。' },
        { en: 'The journey of a thousand miles begins with one step.', cn: '千里之行，始于足下。' },
        { en: 'What you get by achieving your goals is not as important as what you become by achieving your goals.', cn: '通过实现目标你得到的，不如通过实现目标你成为的人重要。' },
        { en: 'The best time to plant a tree was 20 years ago. The second best time is now.', cn: '种一棵树最好的时间是20年前，其次是现在。' },
        { en: 'Education is the most powerful weapon which you can use to change the world.', cn: '教育是你用来改变世界的最强大的武器。' },
        { en: 'The only limit to our realization of tomorrow will be our doubts of today.', cn: '实现明天理想的唯一障碍是今天的疑虑。' }
    ];
    
    const contents = [];
    
    // 生成最近30天的内容
    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = getDateString(date);
        
        const randomWord = words[Math.floor(Math.random() * words.length)];
        const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
        
        contents.push({
            id: `word_${dateStr}`,
            type: 'word',
            content: randomWord.word,
            phonetic: randomWord.phonetic,
            meaning: `${randomWord.pos} ${randomWord.meaning}`,
            example: randomWord.example,
            exampleTranslation: randomWord.exampleCn,
            date: dateStr
        });
        
        contents.push({
            id: `sentence_${dateStr}`,
            type: 'sentence',
            content: randomSentence.en,
            meaning: randomSentence.cn,
            date: dateStr
        });
    }
    
    return contents;
}

// 生成默认打卡记录
function generateDefaultCheckins() {
    const checkins = [];
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    
    users.forEach(user => {
        if (user.username === 'admin') return;
        
        // 为每个用户生成一些历史打卡记录
        for (let i = 0; i < user.totalDays; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            // 随机跳过一些天数（模拟断签）
            if (Math.random() > 0.85) continue;
            
            checkins.push({
                id: `checkin_${user.id}_${getDateString(date)}`,
                userId: user.id,
                checkInDate: getDateString(date),
                createdAt: date.toISOString()
            });
        }
    });
    
    return checkins;
}

// 获取今天日期字符串
function getTodayString() {
    return getDateString(new Date());
}

// 获取昨天日期字符串
function getYesterdayString() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return getDateString(yesterday);
}

// 获取日期字符串
function getDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 用户相关操作
const UserService = {
    // 获取所有用户
    getAll() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    },
    
    // 根据ID获取用户
    getById(id) {
        const users = this.getAll();
        return users.find(u => u.id === id);
    },
    
    // 根据用户名获取用户
    getByUsername(username) {
        const users = this.getAll();
        return users.find(u => u.username === username);
    },
    
    // 登录
    login(username, password) {
        const user = this.getByUsername(username);
        if (user && user.password === password) {
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
            return { success: true, user };
        }
        return { success: false, message: '用户名或密码错误' };
    },
    
    // 登出
    logout() {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    },
    
    // 获取当前用户
    getCurrentUser() {
        const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (userStr) {
            const user = JSON.parse(userStr);
            // 重新从用户列表获取最新数据
            const latestUser = this.getById(user.id);
            return latestUser || user;
        }
        return null;
    },
    
    // 判断是否管理员
    isAdmin(user) {
        const admins = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMINS)) || [];
        return admins.includes(user.workNo) || admins.includes(user.username);
    },
    
    // 添加用户
    add(userData) {
        const users = this.getAll();
        
        // 检查用户名是否已存在
        if (users.some(u => u.username === userData.username)) {
            return { success: false, message: '用户名已存在' };
        }
        
        const newUser = {
            id: String(Date.now()),
            workNo: userData.workNo || '',
            username: userData.username,
            password: userData.password || '123456',
            nickname: userData.nickname || userData.username,
            department: userData.department || '',
            avatarUrl: '',
            continuousDays: 0,
            totalDays: 0,
            lastCheckIn: '',
            createdAt: getTodayString()
        };
        
        users.push(newUser);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        
        return { success: true, user: newUser };
    },
    
    // 更新用户
    update(id, userData) {
        const users = this.getAll();
        const index = users.findIndex(u => u.id === id);
        
        if (index === -1) {
            return { success: false, message: '用户不存在' };
        }
        
        users[index] = { ...users[index], ...userData };
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        
        return { success: true, user: users[index] };
    },
    
    // 删除用户
    delete(id) {
        const users = this.getAll();
        const index = users.findIndex(u => u.id === id);
        
        if (index === -1) {
            return { success: false, message: '用户不存在' };
        }
        
        users.splice(index, 1);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        
        // 同时删除打卡记录
        const checkins = CheckinService.getAll();
        const filteredCheckins = checkins.filter(c => c.userId !== id);
        localStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(filteredCheckins));
        
        return { success: true };
    },
    
    // 重置密码
    resetPassword(id, newPassword = '123456') {
        return this.update(id, { password: newPassword });
    },
    
    // 修改密码
    changePassword(id, oldPassword, newPassword) {
        const user = this.getById(id);
        
        if (user.password !== oldPassword) {
            return { success: false, message: '原密码错误' };
        }
        
        return this.update(id, { password: newPassword });
    },
    
    // 获取排行榜
    getRanking(limit = 50) {
        const users = this.getAll().filter(u => u.username !== 'admin');
        
        // 按连续天数降序，然后按总天数降序
        users.sort((a, b) => {
            if (b.continuousDays !== a.continuousDays) {
                return b.continuousDays - a.continuousDays;
            }
            return b.totalDays - a.totalDays;
        });
        
        return users.slice(0, limit);
    }
};

// 打卡相关操作
const CheckinService = {
    // 获取所有打卡记录
    getAll() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.CHECKINS)) || [];
    },
    
    // 获取用户打卡记录
    getByUserId(userId) {
        const checkins = this.getAll();
        return checkins.filter(c => c.userId === userId);
    },
    
    // 检查今日是否已打卡
    hasCheckedInToday(userId) {
        const checkins = this.getByUserId(userId);
        const today = getTodayString();
        return checkins.some(c => c.checkInDate === today);
    },
    
    // 打卡
    checkIn(userId) {
        // 检查今日是否已打卡
        if (this.hasCheckedInToday(userId)) {
            return { success: false, message: '今日已打卡' };
        }
        
        const user = UserService.getById(userId);
        if (!user) {
            return { success: false, message: '用户不存在' };
        }
        
        const today = getTodayString();
        const yesterday = getYesterdayString();
        
        // 计算连续天数
        let continuousDays = user.continuousDays || 0;
        if (user.lastCheckIn === yesterday) {
            continuousDays++;
        } else {
            continuousDays = 1;
        }
        
        // 添加打卡记录
        const checkins = this.getAll();
        checkins.push({
            id: `checkin_${userId}_${today}`,
            userId,
            checkInDate: today,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(checkins));
        
        // 更新用户数据
        UserService.update(userId, {
            continuousDays,
            totalDays: (user.totalDays || 0) + 1,
            lastCheckIn: today
        });
        
        return {
            success: true,
            data: {
                continuousDays,
                totalDays: (user.totalDays || 0) + 1
            }
        };
    },
    
    // 获取用户某个月的打卡记录
    getMonthCheckins(userId, year, month) {
        const checkins = this.getByUserId(userId);
        return checkins.filter(c => {
            const date = new Date(c.checkInDate);
            return date.getFullYear() === year && date.getMonth() === month;
        });
    },
    
    // 获取用户最近N天的打卡状态
    getRecentCheckins(userId, days = 30) {
        const checkins = this.getByUserId(userId);
        const result = [];
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = getDateString(date);
            
            result.push({
                date: dateStr,
                checked: checkins.some(c => c.checkInDate === dateStr)
            });
        }
        
        return result;
    }
};

// 学习内容相关操作
const ContentService = {
    // 获取所有内容
    getAll() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTENTS)) || [];
    },
    
    // 获取今日内容
    getTodayContent() {
        const contents = this.getAll();
        const today = getTodayString();
        
        const word = contents.find(c => c.type === 'word' && c.date === today);
        const sentence = contents.find(c => c.type === 'sentence' && c.date === today);
        
        // 如果今天没有内容，随机生成
        if (!word || !sentence) {
            this.generateTodayContent();
            return this.getTodayContent();
        }
        
        return { word, sentence };
    },
    
    // 生成今日内容
    generateTodayContent() {
        const contents = this.getAll();
        const today = getTodayString();
        
        // 检查是否已有今日内容
        if (contents.some(c => c.date === today)) {
            return;
        }
        
        // 从历史内容中随机选择
        const words = contents.filter(c => c.type === 'word');
        const sentences = contents.filter(c => c.type === 'sentence');
        
        if (words.length > 0 && sentences.length > 0) {
            const randomWord = words[Math.floor(Math.random() * words.length)];
            const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
            
            contents.push({
                ...randomWord,
                id: `word_${today}`,
                date: today
            });
            
            contents.push({
                ...randomSentence,
                id: `sentence_${today}`,
                date: today
            });
            
            localStorage.setItem(STORAGE_KEYS.CONTENTS, JSON.stringify(contents));
        }
    }
};

// 初始化数据
initializeDefaultData();