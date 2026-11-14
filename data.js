const HUMOR_CATEGORIES = {
  deadpan_oneliner: {
    id: 'deadpan_oneliner',
    name: '冷面一句话神反转 (杨波风)',
    icon: '🧊',
    color: '#4D96FF',
    desc: '极短铺垫、零废话陈述、突发性逻辑与道德逆转，专治成年人理性防御'
  },
  self_deprecation: {
    id: 'self_deprecation',
    name: '硬核自嘲与写实',
    icon: '🎯',
    color: '#FF6B6B',
    desc: '刀刀见血的坦诚幽默，直击现实但不丧，自黑往死里黑的硬核哲理'
  },
  social_satire: {
    id: 'social_satire',
    name: '社会观察与职场讽刺',
    icon: '👔',
    color: '#6BCB77',
    desc: '精准戳破形式主义与装腔作势，打工人秒懂的灵魂共鸣'
  },
  absurdist: {
    id: 'absurdist',
    name: '脑洞无厘头与荒谬',
    icon: '🌀',
    color: '#9D4EDD',
    desc: '脱离地球引力的超展开逻辑，越想越不对劲，再想笑到捶墙'
  },
  animal_chaos: {
    id: 'animal_chaos',
    name: '萌宠迷惑与治愈翻车',
    icon: '🐾',
    color: '#FFD93D',
    desc: '毛孩子眼中的离谱宇宙，物理法则崩溃现场，纯天然多巴胺'
  },
  visual_fails: {
    id: 'visual_fails',
    name: '人类迷惑大赏与神抓拍',
    icon: '🎪',
    color: '#FF9234',
    desc: '生活现场比相声还精彩的真实戏剧性抓拍'
  }
};

const QUIZ_QUESTIONS = [
  {
    id: 'q_yangbo_bath',
    category: 'deadpan_oneliner',
    badge: '流派测试 · 1/6 (杨波招牌)',
    title: '杨波经典神反转：正义的父亲',
    content: '“我小时候住在村里，隔壁是个公共澡堂。\n有一天我爸发现有人趴在墙头偷看女澡堂，我爸特别生气，拎着一根粗棍子就冲出去了，抓到了那个偷看的人。\n我爸把他按在地上狠狠痛打了一顿……\n然后我爸拍了拍手上的灰，抬头看着树顶对我说：”',
    punchline: '“‘波儿，下来吧，该回家吃饭了。’”',
    mediaType: 'text'
  },
  {
    id: 'q_yangbo_lifeguard',
    category: 'deadpan_oneliner',
    badge: '流派测试 · 2/6 (冷面误导)',
    title: '杨波：我那段难忘的救生员经历',
    content: '“我以前去海边当过一段时间救生员。遇到有人溺水的时候，我表现得非常沉着冷静，从来不慌张。\n我会第一时间跳进海里，拼尽全力游到那个人身边，拍拍他的肩膀安慰他：”',
    punchline: '“‘别怕，我已经报警了，警察大概半小时就到。’”',
    mediaType: 'text'
  },
  {
    id: 'q_yangbo_robber',
    category: 'deadpan_oneliner',
    badge: '流派测试 · 3/6 (荒谬现实)',
    title: '深夜遇劫记',
    content: '“那天晚上走夜路，一个戴口罩的壮汉突然掏出刀顶着我：‘要钱还是要命？！’\n我认真思考了三秒钟，我说：‘要钱。’\n劫匪当场愣住了：‘兄弟你不怕死啊？’\n我叹了一口气说：”',
    punchline: '“‘死倒不怕，主要是没钱。’”',
    mediaType: 'text'
  },
  {
    id: 'q_bitter_mom',
    category: 'deadpan_oneliner',
    badge: '流派测试 · 4/6 (家庭大实话)',
    title: '吃得苦中苦',
    content: '“小时候我妈天天摸着我的头对我说：‘吃得苦中苦，方为人上人。’\n现在我快四十岁了，在社会上吃了数不清的苦，我才终于明白了一个深刻的道理：\n我妈是真的能吃苦……”',
    punchline: '“……连这种鬼话都能编出来骗我整整三十年。”',
    mediaType: 'text'
  },
  {
    id: 'q_programmer_wall',
    category: 'self_deprecation',
    badge: '流派测试 · 5/6 (硬核工程翻车)',
    title: '祖传核心承重墙',
    content: '“昨天我终于下定决心，顺手修复了一个在系统里存在了四年的老 Bug。\n今天早上一到公司，整个公司的核心业务系统全部宕机瘫痪，老板站在我背后暴怒：‘为什么改那个地方？！’\n我战战兢兢地看着代码架构图对老板说：”',
    punchline: '“‘老板……那个 Bug 好像是整个系统的核心承重墙。’”',
    mediaType: 'text'
  },
  {
    id: 'q_satire_meeting',
    category: 'social_satire',
    badge: '流派测试 · 6/6 (职场灵魂解构)',
    title: '高效协同的本质',
    content: '“今天下午紧急拉了一个三个小时的跨部门对齐会。\n会议的核心议题是：为了减少大家无效开会的时间，各部门需要输出一份《开会必要性自查表》，并且下周专门开会评审这份自查表。”',
    punchline: '“——用开会来解决开会过多的问题，逻辑闭环得天衣无缝。”',
    mediaType: 'text'
  }
];

const LAUGH_LIBRARY = [
  {
    id: 'yb_01',
    category: 'deadpan_oneliner',
    type: 'text',
    title: '杨波经典：偷看洗澡（完整版）',
    body: '小时候隔壁是公共女澡堂，我爸发现有人趴在墙上偷看，当场暴怒冲过去把那人暴揍一顿。\n那人被打得鼻青脸肿连连求饶，我爸扔掉棍子，面无表情地走到大树底下，抬头对着树杈喊：',
    punchline: '“波儿，下来吧，树上风大，回家喝汤了。”',
    durationSec: 35,
    authorOrSource: '脱口秀演员 杨波',
    tags: ['杨波', '偷看洗澡', '经典反转', '封神之作']
  },
  {
    id: 'yb_02',
    category: 'deadpan_oneliner',
    type: 'text',
    title: '杨波经典：见义勇为的冲动',
    body: '有一次在公共浴室，我突然看到有个猥琐男把手机悄悄伸进隔壁女浴室门缝，我心中的正义之火瞬间喷涌而出，我大吼一声一个箭步冲上去，一把把他推翻在地上：',
    punchline: '“你起开！让我来！”',
    durationSec: 30,
    authorOrSource: '脱口秀演员 杨波',
    tags: ['杨波', '正义感', '猝不及防']
  },
  {
    id: 'yb_03',
    category: 'deadpan_oneliner',
    type: 'text',
    title: '杨波经典：前女友最喜欢什么花',
    body: '前女友跟我分手那天哭得撕心裂肺：“杨波，我们在一起三年，你根本不在乎我，你甚至连我最喜欢什么花都不知道！”\n我插着兜冷冷地看着她：',
    punchline: '“谁说我不知道？你最喜欢‘有钱随便花’。”',
    durationSec: 25,
    authorOrSource: '脱口秀演员 杨波',
    tags: ['杨波', '前女友', '冷幽默']
  },
  {
    id: 'yb_04',
    category: 'deadpan_oneliner',
    type: 'text',
    title: '杨波经典：大孝子买羽绒服',
    body: '去年冬天我花了半个月工资给我妈买了一件高档鹅绒羽绒服，我妈收到后骂了我整整两小时败家。\n第二天早上我下楼，看见我妈穿着羽绒服在小区跳广场舞，故意把两千多块的吊牌甩在外面，逢人便叹气：',
    punchline: '“别提了，我那个傻儿子非要买，死贵死贵的，剪了吊牌还不给退！”',
    durationSec: 40,
    authorOrSource: '杨波脱口秀生活实录',
    tags: ['杨波', '母爱', '人间真实']
  },
  {
    id: 'yb_05',
    category: 'deadpan_oneliner',
    type: 'text',
    title: '杨波经典：关于借钱的高深智慧',
    body: '三年前一个朋友找我借两万块钱，拍着胸脯说下个星期连本带利还给我。现在三年过去了，电话成了空号，微信把我拉黑了。\n在这个寂静的深夜，我终于悟透了一个血淋淋的人生真理：',
    punchline: '“人啊，千万别借钱给快要死的人。”',
    durationSec: 35,
    authorOrSource: '脱口秀演员 杨波',
    tags: ['杨波', '借钱', '地狱笑话']
  },
  {
    id: 'yb_06',
    category: 'deadpan_oneliner',
    type: 'text',
    title: '杨波经典：我与小动物的缘分',
    body: '很多人都说脱口秀演员心肠冷漠，其实不是的，我从小到大就特别有爱心，尤其特别喜欢各种各样的小动物。',
    punchline: '尤其是那种肉质炖得特别软烂、入味脱骨的小动物。',
    durationSec: 25,
    authorOrSource: '脱口秀演员 杨波',
    tags: ['杨波', '小动物', '转折']
  },
  {
    id: 'yb_07',
    category: 'deadpan_oneliner',
    type: 'text',
    title: '杨波经典：医生的忠告',
    body: '体检时医生神情严峻地对我说：“杨先生，根据你的作息，每天少睡两个小时相当于慢性自杀。”\n我听完长舒了一口气：',
    punchline: '“太好了医生，急性自杀我下不去手，慢性的刚好。”',
    durationSec: 30,
    authorOrSource: '杨波脱口秀舞台实录',
    tags: ['杨波', '体检', '自嘲']
  },
  {
    id: 'yb_08',
    category: 'deadpan_oneliner',
    type: 'text',
    title: '杨波经典：导盲犬的考验',
    body: '昨天走在路上，看到一个盲人大哥牵着一条威风凛凛的金毛导盲犬。突然那条狗停在一面厚实的红砖墙前，开始对着空气疯狂摇尾巴。\n盲人大哥非常信任它，大步流星往前迈，‘咚’一声结结实实撞在墙上。\n盲人大哥揉着脑门，从兜里掏出一根香肠喂给狗：',
    punchline: '“‘得先把它喂饱，不然一会儿下黑手打它容易被路人指责。’”',
    durationSec: 45,
    authorOrSource: '脱口秀经典选段',
    tags: ['杨波', '导盲犬', '意外展开']
  },

  {
    id: 'img_01',
    category: 'deadpan_oneliner',
    type: 'image',
    title: '《杨波经典舞台：插兜冷面神还原》',
    body: '“双手插兜，谁也不爱。面瘫三秒，包袱要命。”——脱口秀天花板级别节奏示意图。',
    mediaUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
        <rect width="600" height="400" fill="#0F111A" rx="16"/>
        <circle cx="300" cy="180" r="140" fill="#1A1F2E"/>
        
        <path d="M 230 180 L 250 320 L 350 320 L 370 180 Z" fill="#2E384D"/>
        <line x1="250" y1="230" x2="230" y2="280" stroke="#E2E8F0" stroke-width="8" stroke-linecap="round"/>
        <line x1="350" y1="230" x2="370" y2="280" stroke="#E2E8F0" stroke-width="8" stroke-linecap="round"/>
        
        <circle cx="300" cy="120" r="45" fill="#FBD38D"/>
        <rect x="260" y="80" width="80" height="35" rx="10" fill="#1A202C"/>
        
        <line x1="275" y1="125" x2="295" y2="125" stroke="#1A202C" stroke-width="3" stroke-linecap="round"/>
        <line x1="305" y1="125" x2="325" y2="125" stroke="#1A202C" stroke-width="3" stroke-linecap="round"/>
        <line x1="290" y1="145" x2="310" y2="145" stroke="#1A202C" stroke-width="3" stroke-linecap="round"/>
        
        <rect x="380" y="100" width="18" height="70" rx="6" fill="#718096"/>
        <line x1="389" y1="170" x2="389" y2="350" stroke="#4A5568" stroke-width="4"/>
        
        <text x="300" y="45" fill="#FFD93D" font-size="20" font-weight="bold" text-anchor="middle" font-family="sans-serif">【杨波冷面一句话现场】</text>
        <rect x="50" y="325" width="500" height="50" rx="8" fill="#1E2333" stroke="#FF6B6B" stroke-width="1.5"/>
        <text x="300" y="356" fill="#F8FAFC" font-size="15" font-weight="600" text-anchor="middle">“波儿，下来吧，树上风大，回家喝汤了。”</text>
      </svg>
    `),
    punchline: '——只要我不笑，笑的就是你们。',
    durationSec: 50,
    authorOrSource: '脱口秀名场面插画',
    tags: ['杨波', '名场面', '神图']
  },
  {
    id: 'img_02',
    category: 'self_deprecation',
    type: 'image',
    title: '《软件工程中真实的系统架构与祖传核心承重墙》',
    body: '架构师绘制的高并发分布式架构图 vs 线上真实运行的系统：整座摩天大楼全靠角落里一根被胶带粘着的废弃扫把支撑。',
    mediaUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
        <rect width="600" height="400" fill="#14161F" rx="16"/>
        <text x="300" y="45" fill="#FC8181" font-size="20" font-weight="bold" text-anchor="middle">【千万级日活生产系统现状】</text>
        
        <rect x="150" y="70" width="300" height="180" fill="#2D3748" rx="8" stroke="#E2E8F0" stroke-width="4"/>
        <text x="300" y="140" fill="#E2E8F0" font-size="16" font-weight="bold" text-anchor="middle">核心企业级中台 (2020-2026)</text>
        <text x="300" y="175" fill="#A0AEC0" font-size="13" text-anchor="middle">严禁重启 · 严禁重构 · 严禁呼吸</text>
        
        <line x1="200" y1="250" x2="200" y2="350" stroke="#CBD5E0" stroke-width="14"/>
        <line x1="400" y1="250" x2="400" y2="350" stroke="#E53E3E" stroke-width="4" stroke-dasharray="6,4"/>
        
        <text x="400" y="375" fill="#FEB2B2" font-size="12" text-anchor="middle">⚠️ 承重老Bug</text>
        <text x="200" y="375" fill="#A0AEC0" font-size="12" text-anchor="middle">常规模块</text>
      </svg>
    `),
    punchline: '——“谁敢修复这个Bug，明天全公司就得去接外包。”',
    durationSec: 50,
    authorOrSource: '硅谷经典工程现实',
    tags: ['代码', '真实', '暴击']
  },
  {
    id: 'img_03',
    category: 'visual_fails',
    type: 'image',
    title: '《当代反人类直男施工队神级杰作》',
    body: '某公共卫生间实拍：水龙头距离洗手台边缘 1.5 厘米，出水孔紧贴着台盆内壁，每次洗手必须把手掌压扁成一张纸才能勉强碰到水珠。',
    mediaUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
        <rect width="600" height="400" fill="#181A20" rx="16"/>
        <text x="300" y="45" fill="#FFD93D" font-size="20" font-weight="bold" text-anchor="middle">【鬼斧神工的人性化设计】</text>
        
        <path d="M 80 220 C 180 340, 420 340, 520 220 Z" fill="#2D3748" stroke="#718096" stroke-width="4"/>
        <rect x="80" y="120" width="40" height="100" fill="#E2E8F0" rx="4"/>
        <path d="M 120 130 L 140 130 L 140 160" stroke="#CBD5E0" stroke-width="16" fill="none" stroke-linecap="round"/>
        <line x1="140" y1="165" x2="140" y2="240" stroke="#4299E1" stroke-width="6" stroke-dasharray="8,6"/>
        
        <text x="300" y="350" fill="#E2E8F0" font-size="14" text-anchor="middle">“水龙头：离我太近，算你骚扰”</text>
      </svg>
    `),
    punchline: '——洗手洗出了拆弹专家的紧张感。',
    durationSec: 50,
    authorOrSource: '人类迷惑大赏',
    tags: ['工程翻车', '反人类设计']
  },

  {
    id: 'vid_01',
    category: 'deadpan_oneliner',
    type: 'video',
    title: '脱口秀名场面：杨波《我与我那正义凛然的父亲》',
    body: '“我小时候在村里，公共女澡堂有人偷看，我爸冲出去把那个人打得满地找牙……然后抬头看着树上的我……”——舞台原汁原味高能冷面一句话炸场。',
    mediaUrl: 'assets/yangbo_peeping.mp4',
    interactiveSimulation: {
      type: 'yangbo_stage',
      caption: '🎙️ 杨波舞台名场面：标志性插兜冷面停顿 3 秒，全场笑疯'
    },
    durationSec: 90,
    authorOrSource: '脱口秀大会精选',
    tags: ['杨波', '偷看洗澡', '舞台视频']
  },
  {
    id: 'vid_02',
    category: 'visual_fails',
    type: 'video',
    title: '【高能物理翻车】驾校女学员的“空间传送门”倒车',
    body: '教练在车外淡定指挥：“往右打死，回半圈，慢一点……慢一点……哎？你去哪？你为什么把车倒进了隔壁鱼塘的升降机里？！”',
    mediaUrl: 'assets/parking_fail.mp4',
    interactiveSimulation: {
      type: 'parking_fail',
      caption: '🚗 物理学在这一刻选择了暂时下班'
    },
    durationSec: 85,
    authorOrSource: '驾校监控名场面',
    tags: ['倒车', '迷惑行为', '神抓拍']
  },
  {
    id: 'vid_03',
    category: 'animal_chaos',
    type: 'video',
    title: '【高萌暴击】猫咪被自己尾巴吓得垂直升空 1 米 5',
    body: '正在认真舔毛的黑猫突然回头看到了自己的尾巴，以为是外星生物袭击，全身炸毛原地做了一个完美的垂直火箭发射动作，平移飞上衣柜顶端。',
    mediaUrl: 'assets/cat_launch.mp4',
    interactiveSimulation: {
      type: 'cat_launch',
      caption: '🚀 猫猫空间跳跃技术：无需地心引力'
    },
    durationSec: 80,
    authorOrSource: '猫咪迷惑行为大赏',
    tags: ['猫咪', '起飞', '治愈']
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    HUMOR_CATEGORIES,
    QUIZ_QUESTIONS,
    LAUGH_LIBRARY
  };
}
