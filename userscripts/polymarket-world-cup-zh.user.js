// ==UserScript==
// @name         Polymarket World Cup CN
// @namespace    https://codex.local/pm-wc-cn
// @version      1.1.1
// @description  Polymarket 中文增强：导航精简、体育只保留实时/足球、实时页只显示足球、联赛与队伍汉化（性能修复）
// @updateURL    https://raw.githubusercontent.com/2334336/rooo/main/userscripts/polymarket-world-cup-zh.user.js
// @downloadURL  https://raw.githubusercontent.com/2334336/rooo/main/userscripts/polymarket-world-cup-zh.user.js
// @match        https://polymarket.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(() => {
  "use strict";

  const ATTRS = ["aria-label", "placeholder", "title", "alt"];
  const SKIP_TAG = /^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA|INPUT|SELECT|OPTION|CODE|PRE|SVG|PATH|META|LINK)$/;
  const TOP_NAV_KEEP = new Set([
    "/", "/zh",
    "/sports/world-cup", "/zh/sports/world-cup",
    "/combos", "/zh/combos",
    "/sports/live", "/zh/sports/live",
  ]);

  const SOCCER_CODES = new Set(["afc", "afwq", "arg", "argpn", "aswq", "atc", "auc", "aus", "aut", "bl2", "blr1", "bol1", "bra", "bra2", "bra3", "brcm", "brco", "bul", "bun", "bundesliga", "caf", "ccc", "cde", "cdr", "chi", "chi1", "chi2", "chl2", "cof", "col", "col1", "col2", "con", "conl", "copa", "copaam", "csl", "cwc", "cze1", "den", "dfb", "ecu1", "efa", "efl", "egy1", "el1", "el2", "elc", "enl", "epl", "ere", "es2", "est1", "euc", "ewq", "fif", "fifaw", "fifwc", "fin1", "fl1", "fpd", "fr2", "fro1", "geo1", "grc", "gtm", "hr1", "hun", "icwq", "ind", "ire", "irl1", "isl1", "isp", "isr", "itc", "itsb", "ja2", "jap", "kaz1", "kor", "kor2", "lal", "laliga", "lcs", "lec", "lib", "ligue-1", "ltu1", "lva1", "mar1", "mex", "mls", "nawq", "ncag", "nlc", "nor", "nor2", "nwsl", "ofc", "owq", "per1", "por", "ptc", "rou1", "rus", "sawq", "scoc", "scop", "sea", "serie-a", "skc", "slo", "soccer", "spl", "srb", "ssc", "sud", "svk1", "swe", "swe2", "trsk", "tur", "ucl", "ucol", "uef", "uel", "ueq", "ukr1", "unl", "uru1", "uwcl", "uzb1", "ven1", "weuc", "world-cup", "wwcquefa"]);
  const EXACT = {"Search": "搜索", "搜索 polymarkets...": "搜索 Polymarket...", "Live": "实时", "Games": "比赛", "Props": "球员盘", "Futures": "远期盘", "All": "全部", "Soccer": "足球", "Football": "美式足球", "Basketball": "篮球", "Baseball": "棒球", "Tennis": "网球", "Hockey": "冰球", "Cricket": "板球", "Golf": "高尔夫", "Esports": "电竞", "Combat": "格斗", "Boxing": "拳击", "Chess": "国际象棋", "Pickleball": "匹克球", "Lacrosse": "长曲棍球", "Volleyball": "排球", "Rugby": "橄榄球", "Moneyline": "胜负线", "Spread": "让分", "Total": "总分", "Totals": "总进球", "Over": "大", "Under": "小", "Yes": "是", "No": "否", "Draw": "平局", "DRAW": "平局", "Buy": "买入", "Sell": "卖出", "BUY": "买入", "SELL": "卖出", "Both teams to score": "双方均进球", "Both Teams to Score": "双方均进球", "Both Teams to Score?": "双方均进球？", "First Team to Score": "首支进球队伍", "Team to Advance": "晋级球队", "Extra Time?": "是否进入加时？", "Penalty Shootout?": "是否点球大战？", "Halftime Result": "半场赛果", "Second Half Result": "下半场赛果", "Corners": "角球", "1st Half Corners": "上半场角球", "2nd Half Corners": "下半场角球", "Corners Odd/Even": "角球奇偶", "First Corner": "首个角球", "Odd": "奇数", "Even": "偶数", "OddEven": "奇数偶数", "Reg time": "常规时间", "Avg. Price": "平均价格", "Market": "盘口", "Live stats": "实时数据", "View Finished": "查看已结束", "Add to favorites": "添加到收藏", "Odds format settings": "赔率格式设置", "Select chart window": "选择图表时间窗口", "Any Other Score": "其他比分", "More": "更多", "Sports": "体育", "World Cup": "世界杯", "FIFA World Cup": "FIFA 世界杯", "Combos": "组合", "Trending": "热门", "New": "新盘口", "Popular": "热门", "Ended": "已结束", "Starting soon": "即将开始", "In Progress": "进行中", "Final": "完场", "Half": "半场", "1H": "上半场", "2H": "下半场", "ET": "加时", "PEN": "点球", "FT": "全场", "HT": "半场", "Vol.": "交易量", "Volume": "交易量", "Liquidity": "流动性", "Price": "价格", "Chance": "概率", "Open orders": "未成交订单", "Positions": "持仓", "Order book": "订单簿", "Trade": "交易", "History": "历史", "Rules": "规则", "Comments": "评论", "About": "关于", "Related": "相关", "Show more": "显示更多", "Show less": "收起", "Load more": "加载更多", "No results": "无结果", "Sort by": "排序", "Filter": "筛选", "Today": "今天", "Tomorrow": "明天", "Yesterday": "昨天", "This week": "本周", "This month": "本月", "All Markets": "所有盘口", "All markets": "所有盘口", "Hot markets": "热门盘口", "New markets": "新盘口", "Goal rush stacks": "进球连串", "Assists": "助攻", "Shots": "射门", "Goals": "进球", "goals": "进球", "corners": "角球", "Player Props": "球员盘口", "Game Props": "比赛盘口", "Match Winner": "比赛胜者", "Double Chance": "双重机会", "Correct Score": "正确比分", "Half Time / Full Time": "半全场", "Team Total": "球队总分", "Asian Handicap": "亚洲让球", "Goal Line": "进球线", "Clean Sheet": "零封", "Win to Nil": "零封获胜", "To Qualify": "能否晋级", "To Lift the Trophy": "能否夺冠", "Outright": "冠军盘", "Winner": "冠军", "To Reach Final": "能否进决赛", "Group Winner": "小组第一", "NEITHER": "均不", "Neither": "均不", "Home": "主队", "Away": "客队", "vs": "vs", "VS": "vs", "Fri, July 10": "7 月 10 日，周五", "Sat, July 11": "7 月 11 日，周六", "Sun, July 12": "7 月 12 日，周日", "France vs. Morocco": "法国 vs 摩洛哥", "France vs Morocco": "法国 vs 摩洛哥", "France – Morocco": "法国 vs 摩洛哥", "Spain vs. Belgium": "西班牙 vs 比利时", "Spain vs Belgium": "西班牙 vs 比利时", "Spain vs. Belgium: O/U 2.5": "西班牙 vs 比利时：总分 2.5", "Spain vs Belgium: O/U 2.5": "西班牙 vs 比利时：总分 2.5", "Norway vs. England": "挪威 vs 英格兰", "Norway vs England": "挪威 vs 英格兰", "Argentina vs. Switzerland": "阿根廷 vs 瑞士", "Argentina vs Switzerland": "阿根廷 vs 瑞士", "World Cup: Golden Ball Winner": "世界杯：金球奖得主", "Both Teams to Score in First Half": "上半场双方均进球", "Both Teams to Score in Second Half": "下半场双方均进球", "sort-comments-by": "评论排序", "sort-markets-by": "盘口排序", "world cup 热门盘口": "世界杯热门盘口", "world cup 新盘口": "世界杯新盘口", "More 游戏": "更多游戏", "Y": "是", "N": "否", "O": "大", "U": "小", "FRA": "法国", "MAR": "摩洛哥", "ESP": "西班牙", "BEL": "比利时", "NOR": "挪威", "ENG": "英格兰", "ARG": "阿根廷", "CHE": "瑞士", "fra": "法国", "mar": "摩洛哥", "esp": "西班牙", "bel": "比甲", "nor": "挪威超", "eng": "英格兰", "arg": "阿根廷甲", "che": "瑞士", "soccer": "足球", "football": "美式足球", "world-cup": "世界杯", "fifwc": "世界杯", "epl": "英超", "lal": "西甲", "laliga": "西甲", "bun": "德甲", "bundesliga": "德甲", "sea": "意甲", "serie-a": "意甲", "fl1": "法甲", "ligue-1": "法甲", "ucl": "欧冠", "uel": "欧联", "ucol": "欧协联", "mls": "美职联", "nwsl": "NWSL 女足", "bra": "巴西甲", "bra2": "巴西乙", "bra3": "巴西丙", "mex": "墨西哥联赛", "por": "葡超", "ere": "荷甲", "tur": "土超", "den": "丹麦超", "swe": "瑞典超", "kor": "K联赛", "ja2": "日乙", "jap": "日职联", "spl": "沙特联赛", "sud": "南美杯", "lib": "解放者杯", "auc": "澳大利亚杯", "aus": "澳超", "bol1": "玻利维亚联赛", "chi1": "智利甲", "chi": "智利甲", "rou1": "罗马尼亚超", "per1": "秘鲁甲", "trsk": "土耳其超级杯", "csl": "中超", "col": "哥伦比亚甲", "col1": "哥伦比亚甲", "efl": "英冠", "efa": "英格兰足总杯", "cdr": "西班牙国王杯", "dfb": "德国杯", "cde": "意大利杯", "itc": "意大利杯", "cof": "联合会杯", "con": "美洲杯", "copa": "美洲杯", "caf": "非洲杯", "afc": "亚洲杯", "uef": "欧洲国家联赛", "unl": "欧国联", "fif": "国际足联", "fifaw": "女足世界杯", "cwc": "世俱杯", "ssc": "欧洲超级杯", "elc": "英冠", "bl2": "德乙", "fr2": "法乙", "es2": "西乙", "aut": "奥地利超", "slo": "斯洛文尼亚甲", "bul": "保加利亚甲", "cze1": "捷克甲", "grc": "希腊超", "hun": "匈牙利甲", "isr": "以色列超", "ire": "爱尔兰超", "irl1": "爱尔兰超", "sco": "苏超", "scop": "苏格兰联赛", "scoc": "苏格兰杯", "ukr1": "乌超", "rus": "俄超", "ind": "印度超", "egy1": "埃及超", "mar1": "摩洛哥联赛", "usa": "美国", "lec": "西甲", "lcs": "联赛", "Bolivia LFPB": "玻利维亚联赛", "MLS": "美职联", "Norway Eliteserien": "挪威超级联赛", "Chinese Super League": "中超", "Brazil Série B": "巴西乙级联赛", "Brazil Serie B": "巴西乙级联赛", "K-League": "K联赛", "NWSL": "NWSL 女足", "UCL": "欧冠", "UEL": "欧联", "Sweden Allsvenskan": "瑞典超级联赛", "Brazil Série A": "巴西甲级联赛", "Brazil Serie A": "巴西甲级联赛", "UEFA Europa Conference League": "欧协联", "Australia Cup": "澳大利亚杯", "Liga MX": "墨西哥联赛", "TFF Süper Kupa": "土耳其超级杯", "TFF Super Kupa": "土耳其超级杯", "J2 League": "日乙联赛", "Copa Sudamericana": "南美杯", "Chile Primera": "智利甲级联赛", "Romania SuperLiga": "罗马尼亚超级联赛", "Peru Liga 1": "秘鲁甲级联赛", "Denmark Superliga": "丹麦超级联赛", "Premier League": "英超", "La Liga": "西甲", "Bundesliga": "德甲", "Serie A": "意甲", "Ligue 1": "法甲", "Champions League": "欧冠", "Europa League": "欧联", "Conference League": "欧协联", "Copa Libertadores": "解放者杯", "FA Cup": "足总杯", "EFL Championship": "英冠", "Saudi Pro League": "沙特联赛", "J1 League": "日职联", "J League": "日职联", "Eredivisie": "荷甲", "Primeira Liga": "葡超", "Super Lig": "土超", "Süper Lig": "土超", "Argentine Primera División": "阿根廷甲", "Liga Profesional": "阿根廷甲", "Brasileirão": "巴西甲", "Allsvenskan": "瑞典超", "Eliteserien": "挪威超", "Superliga": "超级联赛", "A-League": "澳超", "Major League Soccer": "美职联", "English Premier League": "英超", "UEFA Champions League": "欧冠", "UEFA Europa League": "欧联", "UEFA Conference League": "欧协联", "Copa America": "美洲杯", "Africa Cup of Nations": "非洲杯", "Asian Cup": "亚洲杯", "Nations League": "欧国联", "Club World Cup": "世俱杯", "International Champions Cup": "国际冠军杯", "Friendly": "友谊赛", "Friendlies": "友谊赛", "Arsenal": "阿森纳", "Arsenal FC": "阿森纳", "Aston Villa": "阿斯顿维拉", "Aston Villa FC": "阿斯顿维拉", "Bournemouth": "伯恩茅斯", "AFC Bournemouth": "伯恩茅斯", "Brentford": "布伦特福德", "Brentford FC": "布伦特福德", "Brighton": "布莱顿", "Brighton & Hove Albion": "布莱顿", "Brighton & Hove Albion FC": "布莱顿", "Burnley": "伯恩利", "Burnley FC": "伯恩利", "Chelsea": "切尔西", "Chelsea FC": "切尔西", "Crystal Palace": "水晶宫", "Crystal Palace FC": "水晶宫", "Everton": "埃弗顿", "Everton FC": "埃弗顿", "Fulham": "富勒姆", "Fulham FC": "富勒姆", "Ipswich": "伊普斯维奇", "Ipswich Town": "伊普斯维奇", "Ipswich Town FC": "伊普斯维奇", "Leicester": "莱斯特城", "Leicester City": "莱斯特城", "Leicester City FC": "莱斯特城", "Liverpool": "利物浦", "Liverpool FC": "利物浦", "Manchester City": "曼城", "Manchester City FC": "曼城", "Man City": "曼城", "Manchester United": "曼联", "Manchester United FC": "曼联", "Man United": "曼联", "Man Utd": "曼联", "Newcastle": "纽卡斯尔", "Newcastle United": "纽卡斯尔", "Newcastle United FC": "纽卡斯尔", "Nottingham Forest": "诺丁汉森林", "Nottingham Forest FC": "诺丁汉森林", "Southampton": "南安普顿", "Southampton FC": "南安普顿", "Tottenham": "热刺", "Tottenham Hotspur": "热刺", "Tottenham Hotspur FC": "热刺", "Spurs": "热刺", "West Ham": "西汉姆", "West Ham United": "西汉姆", "West Ham United FC": "西汉姆", "Wolves": "狼队", "Wolverhampton": "狼队", "Wolverhampton Wanderers": "狼队", "Wolverhampton Wanderers FC": "狼队", "Sunderland": "桑德兰", "Sunderland AFC": "桑德兰", "Leeds": "利兹联", "Leeds United": "利兹联", "Leeds United FC": "利兹联", "Real Madrid": "皇马", "Real Madrid CF": "皇马", "Barcelona": "巴萨", "FC Barcelona": "巴萨", "Barça": "巴萨", "Atletico Madrid": "马竞", "Atlético Madrid": "马竞", "Club Atlético de Madrid": "马竞", "Atletico de Madrid": "马竞", "Sevilla": "塞维利亚", "Sevilla FC": "塞维利亚", "Real Sociedad": "皇家社会", "Real Betis": "贝蒂斯", "Real Betis Balompié": "贝蒂斯", "Villarreal": "比利亚雷亚尔", "Villarreal CF": "比利亚雷亚尔", "Athletic Club": "毕尔巴鄂竞技", "Athletic Bilbao": "毕尔巴鄂竞技", "Valencia": "瓦伦西亚", "Valencia CF": "瓦伦西亚", "Osasuna": "奥萨苏纳", "CA Osasuna": "奥萨苏纳", "Celta Vigo": "塞尔塔", "RC Celta de Vigo": "塞尔塔", "Celta": "塞尔塔", "Getafe": "赫塔费", "Getafe CF": "赫塔费", "Girona": "赫罗纳", "Girona FC": "赫罗纳", "Rayo Vallecano": "巴列卡诺", "Mallorca": "马洛卡", "RCD Mallorca": "马洛卡", "Espanyol": "西班牙人", "RCD Espanyol": "西班牙人", "Alaves": "阿拉维斯", "Deportivo Alavés": "阿拉维斯", "Alavés": "阿拉维斯", "Las Palmas": "拉斯帕尔马斯", "UD Las Palmas": "拉斯帕尔马斯", "Leganes": "莱加内斯", "CD Leganés": "莱加内斯", "Leganés": "莱加内斯", "Valladolid": "巴拉多利德", "Real Valladolid": "巴拉多利德", "Real Valladolid CF": "巴拉多利德", "Elche": "埃尔切", "Elche CF": "埃尔切", "Levante": "莱万特", "Levante UD": "莱万特", "Inter": "国米", "Inter Milan": "国米", "FC Internazionale Milano": "国米", "Internazionale": "国米", "AC Milan": "AC米兰", "Milan": "AC米兰", "Juventus": "尤文图斯", "Juventus FC": "尤文图斯", "Napoli": "那不勒斯", "SSC Napoli": "那不勒斯", "AS Roma": "罗马", "Roma": "罗马", "Lazio": "拉齐奥", "SS Lazio": "拉齐奥", "Atalanta": "亚特兰大", "Atalanta BC": "亚特兰大", "Fiorentina": "佛罗伦萨", "ACF Fiorentina": "佛罗伦萨", "Bologna": "博洛尼亚", "Bologna FC 1909": "博洛尼亚", "Torino": "都灵", "Torino FC": "都灵", "Udinese": "乌迪内斯", "Udinese Calcio": "乌迪内斯", "Sassuolo": "萨索洛", "US Sassuolo Calcio": "萨索洛", "Monza": "蒙扎", "AC Monza": "蒙扎", "Empoli": "恩波利", "Empoli FC": "恩波利", "Cagliari": "卡利亚里", "Cagliari Calcio": "卡利亚里", "Genoa": "热那亚", "Genoa CFC": "热那亚", "Lecce": "莱切", "US Lecce": "莱切", "Verona": "维罗纳", "Hellas Verona": "维罗纳", "Hellas Verona FC": "维罗纳", "Parma": "帕尔马", "Parma Calcio 1913": "帕尔马", "Como": "科莫", "Como 1907": "科莫", "Venezia": "威尼斯", "Venezia FC": "威尼斯", "Bayern Munich": "拜仁慕尼黑", "Bayern München": "拜仁慕尼黑", "FC Bayern München": "拜仁慕尼黑", "Bayern": "拜仁慕尼黑", "Borussia Dortmund": "多特蒙德", "BV Borussia 09 Dortmund": "多特蒙德", "Dortmund": "多特蒙德", "RB Leipzig": "莱比锡红牛", "Bayer Leverkusen": "勒沃库森", "Bayer 04 Leverkusen": "勒沃库森", "Leverkusen": "勒沃库森", "Eintracht Frankfurt": "法兰克福", "VfB Stuttgart": "斯图加特", "Stuttgart": "斯图加特", "Borussia Mönchengladbach": "门兴", "Borussia Monchengladbach": "门兴", "Gladbach": "门兴", "Wolfsburg": "沃尔夫斯堡", "VfL Wolfsburg": "沃尔夫斯堡", "Freiburg": "弗赖堡", "SC Freiburg": "弗赖堡", "Hoffenheim": "霍芬海姆", "TSG Hoffenheim": "霍芬海姆", "TSG 1899 Hoffenheim": "霍芬海姆", "Werder Bremen": "不莱梅", "SV Werder Bremen": "不莱梅", "Augsburg": "奥格斯堡", "FC Augsburg": "奥格斯堡", "Mainz": "美因茨", "1. FSV Mainz 05": "美因茨", "Mainz 05": "美因茨", "Union Berlin": "柏林联合", "1. FC Union Berlin": "柏林联合", "Bochum": "波鸿", "VfL Bochum": "波鸿", "VfL Bochum 1848": "波鸿", "Heidenheim": "海登海姆", "1. FC Heidenheim 1846": "海登海姆", "1. FC Heidenheim": "海登海姆", "Holstein Kiel": "基尔", "St. Pauli": "圣保利", "FC St. Pauli": "圣保利", "Koln": "科隆", "Köln": "科隆", "1. FC Köln": "科隆", "FC Cologne": "科隆", "Paderborn": "帕德博恩", "PSG": "巴黎圣日耳曼", "Paris Saint-Germain": "巴黎圣日耳曼", "Paris Saint-Germain FC": "巴黎圣日耳曼", "Paris SG": "巴黎圣日耳曼", "Marseille": "马赛", "Olympique de Marseille": "马赛", "Olympique Marseille": "马赛", "Lyon": "里昂", "Olympique Lyonnais": "里昂", "Monaco": "摩纳哥", "AS Monaco": "摩纳哥", "AS Monaco FC": "摩纳哥", "Lille": "里尔", "LOSC Lille": "里尔", "Nice": "尼斯", "OGC Nice": "尼斯", "Rennes": "雷恩", "Stade Rennais": "雷恩", "Stade Rennais FC": "雷恩", "Lens": "朗斯", "RC Lens": "朗斯", "Strasbourg": "斯特拉斯堡", "RC Strasbourg": "斯特拉斯堡", "RC Strasbourg Alsace": "斯特拉斯堡", "Nantes": "南特", "FC Nantes": "南特", "Toulouse": "图卢兹", "Toulouse FC": "图卢兹", "Reims": "兰斯", "Stade de Reims": "兰斯", "Montpellier": "蒙彼利埃", "Montpellier HSC": "蒙彼利埃", "Brest": "布雷斯特", "Stade Brestois 29": "布雷斯特", "Auxerre": "欧塞尔", "AJ Auxerre": "欧塞尔", "Angers": "昂热", "Angers SCO": "昂热", "Le Havre": "勒阿弗尔", "Le Havre AC": "勒阿弗尔", "Saint-Etienne": "圣埃蒂安", "Saint-Étienne": "圣埃蒂安", "AS Saint-Étienne": "圣埃蒂安", "AS Saint-Etienne": "圣埃蒂安", "Lorient": "洛里昂", "FC Lorient": "洛里昂", "Paris FC": "巴黎FC", "Ajax": "阿贾克斯", "AFC Ajax": "阿贾克斯", "PSV": "PSV埃因霍温", "PSV Eindhoven": "PSV埃因霍温", "Feyenoord": "费耶诺德", "Benfica": "本菲卡", "SL Benfica": "本菲卡", "Porto": "波尔图", "FC Porto": "波尔图", "Sporting CP": "葡萄牙体育", "Sporting Lisbon": "葡萄牙体育", "Sporting": "葡萄牙体育", "Celtic": "凯尔特人", "Celtic FC": "凯尔特人", "Rangers": "流浪者", "Rangers FC": "流浪者", "Galatasaray": "加拉塔萨雷", "Galatasaray SK": "加拉塔萨雷", "Fenerbahce": "费内巴切", "Fenerbahçe": "费内巴切", "Fenerbahçe SK": "费内巴切", "Besiktas": "贝西克塔斯", "Beşiktaş": "贝西克塔斯", "Beşiktaş JK": "贝西克塔斯", "Shakhtar Donetsk": "顿涅茨克矿工", "FC Shakhtar Donetsk": "顿涅茨克矿工", "Dynamo Kyiv": "基辅迪纳摩", "FC Dynamo Kyiv": "基辅迪纳摩", "Red Bull Salzburg": "萨尔茨堡红牛", "FC Red Bull Salzburg": "萨尔茨堡红牛", "Club Brugge": "布鲁日", "Club Brugge KV": "布鲁日", "Anderlecht": "安德莱赫特", "RSC Anderlecht": "安德莱赫特", "Olympiacos": "奥林匹亚科斯", "Olympiacos FC": "奥林匹亚科斯", "Panathinaikos": "帕纳辛奈科斯", "Slavia Prague": "布拉格斯拉维亚", "SK Slavia Praha": "布拉格斯拉维亚", "Sparta Prague": "布拉格斯巴达", "AC Sparta Praha": "布拉格斯巴达", "Young Boys": "年轻人", "BSC Young Boys": "年轻人", "Basel": "巴塞尔", "FC Basel": "巴塞尔", "FC Basel 1893": "巴塞尔", "Al Hilal": "希拉尔", "Al Hilal Saudi Club": "希拉尔", "Al Nassr": "纳斯尔", "Al Nassr Saudi Club": "纳斯尔", "Al Ittihad": "伊蒂哈德", "Al Ittihad Saudi Club": "伊蒂哈德", "Al Ahli": "艾希利", "Al Ahli Saudi Club": "艾希利", "Inter Miami": "迈阿密国际", "Inter Miami CF": "迈阿密国际", "LA Galaxy": "洛杉矶银河", "LAFC": "洛杉矶FC", "Los Angeles FC": "洛杉矶FC", "Seattle Sounders": "西雅图海湾人", "Seattle Sounders FC": "西雅图海湾人", "Atlanta United": "亚特兰大联", "Atlanta United FC": "亚特兰大联", "New York City FC": "纽约城", "New York Red Bulls": "纽约红牛", "Chicago Fire": "芝加哥火焰", "Chicago Fire FC": "芝加哥火焰", "FC Cincinnati": "辛辛那提", "Columbus Crew": "哥伦布机员", "Philadelphia Union": "费城联", "Orlando City": "奥兰多城", "Orlando City SC": "奥兰多城", "Austin FC": "奥斯汀FC", "Charlotte FC": "夏洛特FC", "Houston Dynamo": "休斯顿迪纳摩", "Houston Dynamo FC": "休斯顿迪纳摩", "Real Salt Lake": "皇家盐湖城", "CF Montréal": "蒙特利尔", "CF Montreal": "蒙特利尔", "Toronto FC": "多伦多FC", "Vancouver Whitecaps": "温哥华白帽", "Vancouver Whitecaps FC": "温哥华白帽", "Portland Timbers": "波特兰伐木者", "Sporting Kansas City": "堪萨斯城竞技", "Minnesota United": "明尼苏达联", "Minnesota United FC": "明尼苏达联", "FC Dallas": "达拉斯FC", "Nashville SC": "纳什维尔", "St. Louis City": "圣路易斯城", "St. Louis City SC": "圣路易斯城", "San Diego FC": "圣地亚哥FC", "San Jose Earthquakes": "圣何塞地震", "Colorado Rapids": "科罗拉多急流", "DC United": "DC联", "D.C. United": "DC联", "New England Revolution": "新英格兰革命", "Flamengo": "弗拉门戈", "CR Flamengo": "弗拉门戈", "Palmeiras": "帕尔梅拉斯", "SE Palmeiras": "帕尔梅拉斯", "Corinthians": "科林蒂安", "SC Corinthians Paulista": "科林蒂安", "Sao Paulo": "圣保罗", "São Paulo": "圣保罗", "São Paulo FC": "圣保罗", "Santos": "桑托斯", "Santos FC": "桑托斯", "Fluminense": "弗鲁米嫩塞", "Fluminense FC": "弗鲁米嫩塞", "Gremio": "格雷米奥", "Grêmio": "格雷米奥", "Grêmio FBPA": "格雷米奥", "Internacional": "国际体育会", "SC Internacional": "国际体育会", "Atletico Mineiro": "米内罗竞技", "Atlético Mineiro": "米内罗竞技", "Clube Atlético Mineiro": "米内罗竞技", "Botafogo": "博塔弗戈", "Botafogo FR": "博塔弗戈", "Botafogo FC": "博塔弗戈", "River Plate": "河床", "CA River Plate": "河床", "Boca Juniors": "博卡青年", "CA Boca Juniors": "博卡青年", "Racing Club": "竞技俱乐部", "Independiente": "独立队", "CA Independiente": "独立队", "San Lorenzo": "圣洛伦索", "CA San Lorenzo de Almagro": "圣洛伦索", "Club America": "美洲队", "Club América": "美洲队", "Guadalajara": "瓜达拉哈拉", "CD Guadalajara": "瓜达拉哈拉", "Chivas": "奇瓦斯", "Monterrey": "蒙特雷", "CF Monterrey": "蒙特雷", "Tigres": "老虎队", "Tigres UANL": "老虎队", "Cruz Azul": "十字蓝", "Pumas": "普马斯", "Pumas UNAM": "普马斯", "Club Universidad Nacional": "普马斯", "Toluca": "托卢卡", "Deportivo Toluca": "托卢卡", "Santos Laguna": "桑托斯拉古纳", "Pachuca": "帕丘卡", "CF Pachuca": "帕丘卡", "Atlas": "阿特拉斯", "Atlas FC": "阿特拉斯", "Leon": "莱昂", "León": "莱昂", "Club León": "莱昂", "Necaxa": "内卡萨", "Club Necaxa": "内卡萨", "Pohang Steelers": "浦项制铁", "Gwangju": "光州FC", "Gwangju FC": "光州FC", "Gimcheon Sangmu": "金泉尚武", "Bucheon FC": "富川FC", "Bucheon FC 1995": "富川FC", "Jeonbuk": "全北现代", "Jeonbuk Hyundai Motors": "全北现代", "Ulsan": "蔚山现代", "Ulsan HD": "蔚山现代", "Ulsan Hyundai": "蔚山现代", "FC Seoul": "首尔FC", "Suwon": "水原", "Suwon Samsung Bluewings": "水原三星", "Kawasaki Frontale": "川崎前锋", "Yokohama F. Marinos": "横滨水手", "Kashima Antlers": "鹿岛鹿角", "Urawa Red Diamonds": "浦和红钻", "Vissel Kobe": "神户胜利船", "Cerezo Osaka": "大阪樱花", "Gamba Osaka": "大阪钢巴", "Nagoya Grampus": "名古屋鲸八", "FC Tokyo": "东京FC", "France": "法国", "Morocco": "摩洛哥", "Spain": "西班牙", "Belgium": "比利时", "Norway": "挪威", "England": "英格兰", "Argentina": "阿根廷", "Switzerland": "瑞士", "Brazil": "巴西", "Germany": "德国", "Portugal": "葡萄牙", "Netherlands": "荷兰", "Italy": "意大利", "Croatia": "克罗地亚", "Uruguay": "乌拉圭", "Colombia": "哥伦比亚", "Mexico": "墨西哥", "USA": "美国", "United States": "美国", "Canada": "加拿大", "Japan": "日本", "South Korea": "韩国", "Korea Republic": "韩国", "Australia": "澳大利亚", "Senegal": "塞内加尔", "Nigeria": "尼日利亚", "Ghana": "加纳", "Cameroon": "喀麦隆", "Egypt": "埃及", "Algeria": "阿尔及利亚", "Tunisia": "突尼斯", "South Africa": "南非", "Saudi Arabia": "沙特阿拉伯", "Iran": "伊朗", "Iraq": "伊拉克", "Qatar": "卡塔尔", "UAE": "阿联酋", "China": "中国", "India": "印度", "Poland": "波兰", "Denmark": "丹麦", "Sweden": "瑞典", "Austria": "奥地利", "Czechia": "捷克", "Czech Republic": "捷克", "Serbia": "塞尔维亚", "Ukraine": "乌克兰", "Turkey": "土耳其", "Türkiye": "土耳其", "Greece": "希腊", "Scotland": "苏格兰", "Wales": "威尔士", "Ireland": "爱尔兰", "Republic of Ireland": "爱尔兰", "Northern Ireland": "北爱尔兰", "Chile": "智利", "Peru": "秘鲁", "Ecuador": "厄瓜多尔", "Paraguay": "巴拉圭", "Bolivia": "玻利维亚", "Venezuela": "委内瑞拉", "Panama": "巴拿马", "Costa Rica": "哥斯达黎加", "Jamaica": "牙买加", "Honduras": "洪都拉斯", "New Zealand": "新西兰"};
  // Only medium/long phrases participate in contains-replace.
  const PHRASE_KEYS = Object.keys(EXACT)
    .filter((k) => k.length >= 4 && /[A-Za-z]/.test(k))
    .sort((a, b) => b.length - a.length);

  const CODE_MAP = {
    FRA: "法国", MAR: "摩洛哥", ESP: "西班牙", BEL: "比利时",
    NOR: "挪威", ENG: "英格兰", ARG: "阿根廷", CHE: "瑞士",
    BRA: "巴西", GER: "德国", POR: "葡萄牙", NED: "荷兰",
    ITA: "意大利", CRO: "克罗地亚", URU: "乌拉圭", COL: "哥伦比亚",
    MEX: "墨西哥", USA: "美国", CAN: "加拿大", JPN: "日本",
    KOR: "韩国", AUS: "澳大利亚", SUI: "瑞士", DEN: "丹麦",
    SWE: "瑞典", AUT: "奥地利", POL: "波兰", TUR: "土耳其",
    SCO: "苏格兰", WAL: "威尔士", IRL: "爱尔兰", CHI: "智利",
    PER: "秘鲁", ECU: "厄瓜多尔", PAR: "巴拉圭", BOL: "玻利维亚",
    VEN: "委内瑞拉", SEN: "塞内加尔", NGA: "尼日利亚", GHA: "加纳",
    CMR: "喀麦隆", EGY: "埃及", ALG: "阿尔及利亚", TUN: "突尼斯",
    RSA: "南非", KSA: "沙特", IRN: "伊朗", QAT: "卡塔尔",
    UAE: "阿联酋", CHN: "中国", UKR: "乌克兰", CZE: "捷克",
    SRB: "塞尔维亚", GRE: "希腊", NZL: "新西兰",
  };

  const NON_SOCCER_CODES = new Set([
    "basketball","baseball","tennis","cricket","football","hockey","golf","mma","ufc","boxing",
    "chess","pickleball","lacrosse","esports","nhl","nba","mlb","nfl","wnba","atp","wta","itf",
    "wimbledon","f1","cfb","cfl","powerslap","vbvnl","nbasl","atp-doubles","wta-doubles",
    "crint","cricmlc","cricshpageeza","cricjcl","crict20blast","cricmaharaja","crictelangana",
  ]);

  let scheduled = false;
  let translating = false;
  let soccerExpanded = false;
  let lastPath = "";
  let lastFullTranslate = 0;
  const processedText = new WeakSet();
  const processedEl = new WeakSet();

  function path() { return location.pathname || "/"; }
  function isSportsArea() { return /\/sports(\/|$)/.test(path()) || /\/event\//.test(path()); }
  function isLivePage() { return /\/sports\/live\/?$/.test(path()); }
  function isWorldCupPage() { return /\/sports\/world-cup|\/event\/fifwc-/.test(path()); }
  function isTranslatePage() {
    return isSportsArea() || path() === "/" || path() === "/zh" || /\/combos/.test(path());
  }

  function injectCSS() {
    if (document.getElementById("pm-wc-cn-style")) return;
    const style = document.createElement("style");
    style.id = "pm-wc-cn-style";
    style.textContent = `
      footer { display: none !important; }
      /* hide common non-soccer sports rows when on sports pages */
      body.pm-wc-cn-sports a[href*="/sports/basketball"],
      body.pm-wc-cn-sports a[href*="/sports/baseball"],
      body.pm-wc-cn-sports a[href*="/sports/tennis"],
      body.pm-wc-cn-sports a[href*="/sports/cricket"],
      body.pm-wc-cn-sports a[href*="/sports/football"],
      body.pm-wc-cn-sports a[href*="/sports/hockey"],
      body.pm-wc-cn-sports a[href*="/sports/golf"],
      body.pm-wc-cn-sports a[href*="/sports/mma"],
      body.pm-wc-cn-sports a[href*="/sports/ufc"],
      body.pm-wc-cn-sports a[href*="/sports/boxing"],
      body.pm-wc-cn-sports a[href*="/sports/chess"],
      body.pm-wc-cn-sports a[href*="/sports/pickleball"],
      body.pm-wc-cn-sports a[href*="/sports/lacrosse"],
      body.pm-wc-cn-sports a[href*="/sports/nba"],
      body.pm-wc-cn-sports a[href*="/sports/mlb"],
      body.pm-wc-cn-sports a[href*="/sports/nhl"],
      body.pm-wc-cn-sports a[href*="/sports/nfl"],
      body.pm-wc-cn-sports a[href*="/sports/wnba"],
      body.pm-wc-cn-sports a[href*="/sports/atp"],
      body.pm-wc-cn-sports a[href*="/sports/wta"],
      body.pm-wc-cn-sports a[href*="/sports/itf"],
      body.pm-wc-cn-sports a[href*="/sports/wimbledon"],
      body.pm-wc-cn-sports a[href*="/sports/f1"],
      body.pm-wc-cn-sports a[href*="/sports/cfb"],
      body.pm-wc-cn-sports a[href*="/sports/cfl"] {
        display: none !important;
      }
      body.pm-wc-cn-sports a[href*="/sports/basketball"] { }
      /* force open soccer submenu if present */
      body.pm-wc-cn-sports .pm-wc-cn-open,
      body.pm-wc-cn-sports .pm-wc-cn-open > * {
        height: auto !important;
        overflow: visible !important;
        opacity: 1 !important;
        display: block !important;
      }
    `;
    document.documentElement.appendChild(style);
  }

  function updateBodyClass() {
    document.body && document.body.classList.toggle("pm-wc-cn-sports", isSportsArea());
  }

  function shouldSkip(el) {
    return !el || SKIP_TAG.test(el.tagName) || el.isContentEditable || el.closest("svg");
  }

  function translateText(raw) {
    if (raw == null) return raw;
    const s0 = String(raw);
    if (!s0 || s0.length > 180) return s0; // avoid heavy work on huge blobs
    if (!/[A-Za-z]/.test(s0)) return s0;

    const lead = (s0.match(/^\s*/) || [""])[0];
    const trail = (s0.match(/\s*$/) || [""])[0];
    const core = s0.trim().replace(/\s+/g, " ");
    if (Object.prototype.hasOwnProperty.call(EXACT, core)) return lead + EXACT[core] + trail;

    let s = s0;

    // Cheap regex first
    s = s
      .replace(/(\$[0-9.]+[KMB]?)\s*Vol\./g, "$1 交易量")
      .replace(/Avg\.\s*Price/g, "平均价格")
      .replace(/\bOver\s*(\d+(?:\.\d+)?)\b/g, "大 $1")
      .replace(/\bUnder\s*(\d+(?:\.\d+)?)\b/g, "小 $1")
      .replace(/\bO\s*(\d+(?:\.\d+)?)\b/g, "大 $1")
      .replace(/\bU\s*(\d+(?:\.\d+)?)\b/g, "小 $1")
      .replace(/\bMoneyline\b/g, "胜负线")
      .replace(/\bSpread\b/g, "让分")
      .replace(/\bTotals?\b/g, "总进球")
      .replace(/\bBoth teams to score\b/gi, "双方均进球")
      .replace(/\bDraw\b/g, "平局")
      .replace(/\bcorners\b/gi, "角球")
      .replace(/\bgoals\b/gi, "进球");

    // Phrase replace only for short-ish strings
    if (s.length <= 80) {
      for (let i = 0; i < PHRASE_KEYS.length; i++) {
        const key = PHRASE_KEYS[i];
        if (s.indexOf(key) !== -1) s = s.split(key).join(EXACT[key]);
      }
    } else if (s.length <= 140) {
      // fewer long phrases only
      for (let i = 0; i < Math.min(PHRASE_KEYS.length, 120); i++) {
        const key = PHRASE_KEYS[i];
        if (key.length < 6) break;
        if (s.indexOf(key) !== -1) s = s.split(key).join(EXACT[key]);
      }
    }

    s = s.replace(/\b([A-Za-z][A-Za-z .&'’-]{1,40}?)\s*([+-]\d+(?:\.\d+)?)\b/g, function (full, name, odds) {
      const t = name.trim();
      if (EXACT[t]) return EXACT[t] + " " + odds;
      const up = t.toUpperCase();
      if (CODE_MAP[up]) return CODE_MAP[up] + " " + odds;
      return full;
    });

    s = s.replace(/\b([A-Z]{3,4})\b/g, function (m) { return CODE_MAP[m] || EXACT[m] || m; });
    s = s
      .replace(/(买入|卖出)\s*是(?:es|e|s)\b/g, "$1 是")
      .replace(/(买入|卖出)\s*否o?\b/g, "$1 否");
    return s;
  }

  function translateNodeText(node) {
    if (!node || node.nodeType !== 3 || processedText.has(node)) return;
    if (shouldSkip(node.parentElement)) return;
    const val = node.nodeValue;
    if (!val || !/[A-Za-z]/.test(val)) {
      processedText.add(node);
      return;
    }
    const next = translateText(val);
    if (next !== val) node.nodeValue = next;
    processedText.add(node);
  }

  function fixBuySellButton(el) {
    if (!el || el.tagName !== "BUTTON" || shouldSkip(el)) return;
    const t = (el.textContent || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
    let next = "";
    if (/^(Buy|买入)\s*(Yes|是es|是)$/.test(t)) next = "买入 是";
    else if (/^(Buy|买入)\s*(No|否o|否)$/.test(t)) next = "买入 否";
    else if (/^(Sell|卖出)\s*(Yes|是es|是)$/.test(t)) next = "卖出 是";
    else if (/^(Sell|卖出)\s*(No|否o|否)$/.test(t)) next = "卖出 否";
    else if (/^(Yes|是es)$/.test(t)) next = "是";
    else if (/^(No|否o)$/.test(t)) next = "否";
    if (!next) return;
    // set textContent once; cheaper and avoids multi-text-node churn
    if ((el.textContent || "").trim() !== next) el.textContent = next;
  }

  function translateElement(el) {
    if (!el || el.nodeType !== 1 || shouldSkip(el) || processedEl.has(el)) return;
    if (el.tagName === "BUTTON") fixBuySellButton(el);
    for (let i = 0; i < ATTRS.length; i++) {
      const attr = ATTRS[i];
      if (!el.hasAttribute(attr)) continue;
      const old = el.getAttribute(attr);
      if (!old || !/[A-Za-z]/.test(old)) continue;
      const next = translateText(old);
      if (next !== old) el.setAttribute(attr, next);
    }
    processedEl.add(el);
  }

  function translateTree(root) {
    if (!root || translating) return;
    translating = true;
    try {
      if (root.nodeType === 3) {
        translateNodeText(root);
        return;
      }
      if (root.nodeType !== 1 && root.nodeType !== 9) return;
      translateElement(root);
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node || !node.nodeValue || !/[A-Za-z]/.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
          if (shouldSkip(node.parentElement)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      let n = walker.nextNode();
      let count = 0;
      while (n && count < 2500) {
        translateNodeText(n);
        n = walker.nextNode();
        count++;
      }
      if (root.querySelectorAll) {
        root.querySelectorAll("button, [aria-label], [title], [placeholder], [alt]").forEach(translateElement);
      }
    } finally {
      translating = false;
    }
  }

  function simplifyTopNav() {
    const nav = document.querySelector('nav[aria-label="Main"]') || document.querySelector("nav");
    if (!nav) return;
    // Find a parent that contains multiple of our keep links
    const keepAnchors = Array.from(nav.querySelectorAll("a[href]")).filter((a) => TOP_NAV_KEEP.has(a.getAttribute("href") || ""));
    if (!keepAnchors.length) return;
    const parent = keepAnchors[0].parentElement;
    if (!parent) return;
    parent.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href") || "";
      a.style.display = TOP_NAV_KEEP.has(href) ? "" : "none";
    });
    const more = parent.parentElement && parent.parentElement.querySelector('button[aria-label="Open more navigation links"], button[aria-label="More menu"]');
    if (more) more.style.display = "none";
  }

  function hrefCode(href) {
    if (!href) return "";
    try {
      const u = href.startsWith("http") ? new URL(href) : new URL(href, location.origin);
      const m = u.pathname.match(/\/sports\/([a-z0-9-]+)(?:\/|$)/);
      return m ? m[1] : "";
    } catch (_) { return ""; }
  }

  function isSoccerHref(href) {
    const code = hrefCode(href);
    if (!code || code === "live" || code === "futures") return false;
    if (code === "soccer" || code === "world-cup") return true;
    return SOCCER_CODES.has(code);
  }

  function closestRow(el) {
    return el.closest("div.group") || el.closest("li") || el.parentElement || el;
  }

  function expandSoccerLeagues() {
    if (!isSportsArea() || soccerExpanded) return;
    const buttons = document.querySelectorAll('button[aria-label*="sub-items"]');
    let clicked = false;
    buttons.forEach((btn) => {
      const aria = btn.getAttribute("aria-label") || "";
      const parentText = ((btn.parentElement && btn.parentElement.textContent) || "").slice(0, 80);
      const text = aria + " " + parentText;
      const isSoccer = /足球|Soccer|World Cup|世界杯/i.test(text);
      const isOther = /篮球|网球|棒球|板球|冰球|橄榄球|高尔夫|格斗|拳击|国际象棋|匹克球|长曲棍球|排球|电竞|美式足球|Basketball|Tennis|Baseball|Cricket|Hockey|Football|Golf|Combat|UFC|MLB|NBA|NHL|NFL|Wimbledon|ATP|WTA/i.test(text);
      if (isOther && !isSoccer) {
        const row = closestRow(btn);
        if (row) row.style.display = "none";
        return;
      }
      if (!isSoccer) return;
      // Prefer CSS open over click to avoid mutation storms.
      let p = btn.parentElement;
      for (let i = 0; i < 4 && p; i++) {
        p.querySelectorAll('[aria-hidden="true"], .rah-static--height-zero').forEach((box) => {
          box.classList.add("pm-wc-cn-open");
          box.setAttribute("aria-hidden", "false");
        });
        p = p.parentElement;
      }
      if (!clicked && btn.getAttribute("aria-expanded") === "false") {
        clicked = true;
        // one-time click only
        setTimeout(() => {
          try { if (btn.getAttribute("aria-expanded") === "false") btn.click(); } catch (_) {}
        }, 50);
      }
    });
    soccerExpanded = true;
  }

  function simplifySportsSidebar() {
    if (!isSportsArea()) return;
    // Hide non-soccer category rows not covered by CSS
    document.querySelectorAll('a[href*="/sports/"]').forEach((a) => {
      const href = a.getAttribute("href") || "";
      const code = hrefCode(href);
      if (/\/sports\/live\/?$/.test(href) || isSoccerHref(href)) {
        const row = closestRow(a);
        if (row && row.style.display === "none") row.style.display = "";
        return;
      }
      if (NON_SOCCER_CODES.has(code)) {
        const row = closestRow(a);
        if (row) row.style.display = "none";
      }
    });
  }

  function simplifyLiveFeed() {
    if (!isLivePage()) return;
    const list = document.querySelector('[data-testid="virtuoso-item-list"]');
    if (!list) return;
    list.querySelectorAll("[data-index]").forEach((node) => {
      const links = node.querySelectorAll('a[href*="/sports/"]');
      if (!links.length) return;
      let soccer = false;
      let non = false;
      links.forEach((l) => {
        const href = l.getAttribute("href") || "";
        if (isSoccerHref(href)) soccer = true;
        else {
          const c = hrefCode(href);
          if (c && c !== "live") non = true;
        }
      });
      if (non && !soccer) node.style.display = "none";
      else if (soccer) node.style.display = "";
    });
  }

  function cleanupWorldCupExtras() {
    if (!isWorldCupPage()) return;
    document.querySelectorAll('a[href*="tab=props"],a[href*="tab=bracket"],a[href*="tab=map"]').forEach((el) => {
      el.style.display = "none";
    });
    const comments = document.querySelector("#commentsInner");
    if (comments && comments.parentElement) comments.parentElement.style.display = "none";
    let about = document.querySelector("#about");
    about = about && about.parentElement && about.parentElement.parentElement;
    while (about) {
      about.style.display = "none";
      about = about.nextElementSibling;
    }
  }

  function hideAllMarketsBlock() {
    const hs = document.querySelectorAll("h2");
    for (let i = 0; i < hs.length; i++) {
      const t = (hs[i].textContent || "").trim();
      if (t === "所有盘口" || t === "All Markets") {
        const wrap = hs[i].parentElement && hs[i].parentElement.parentElement && hs[i].parentElement.parentElement.parentElement;
        if (wrap) wrap.style.display = "none";
        break;
      }
    }
  }

  function onRouteChange() {
    const p = path();
    if (p === lastPath) return false;
    lastPath = p;
    soccerExpanded = false;
    lastFullTranslate = 0;
    updateBodyClass();
    return true;
  }

  function runLight() {
    injectCSS();
    updateBodyClass();
    simplifyTopNav();
    if (isSportsArea()) {
      expandSoccerLeagues();
      simplifySportsSidebar();
    }
    if (isLivePage()) simplifyLiveFeed();
    cleanupWorldCupExtras();
    hideAllMarketsBlock();
  }

  function runTranslateFull() {
    if (!isTranslatePage()) return;
    const now = Date.now();
    if (now - lastFullTranslate < 3000) return; // throttle full scans
    lastFullTranslate = now;
    translateTree(document.body);
  }

  function schedule(kind) {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      const routed = onRouteChange();
      runLight();
      if (kind === "full" || routed) runTranslateFull();
    });
  }

  function boot() {
    lastPath = path();
    injectCSS();
    updateBodyClass();
    runLight();
    // initial translate once, delayed slightly so page can paint
    setTimeout(() => {
      if (isTranslatePage()) translateTree(document.body);
      lastFullTranslate = Date.now();
    }, 100);

    if (window.MutationObserver) {
      let mutBuf = [];
      let mutScheduled = false;
      const flushMut = () => {
        mutScheduled = false;
        if (!isTranslatePage()) {
          schedule("light");
          mutBuf = [];
          return;
        }
        const batch = mutBuf;
        mutBuf = [];
        // translate only changed bits
        for (let i = 0; i < batch.length && i < 80; i++) {
          const m = batch[i];
          if (m.type === "characterData") translateNodeText(m.target);
          else if (m.type === "attributes") translateElement(m.target);
          else if (m.addedNodes && m.addedNodes.length) {
            for (let j = 0; j < m.addedNodes.length; j++) {
              const node = m.addedNodes[j];
              if (node && (node.nodeType === 1 || node.nodeType === 3)) translateTree(node);
            }
          }
        }
        schedule("light");
      };

      new MutationObserver((mutations) => {
        // ignore mutations caused by our own translating where possible
        if (translating) return;
        for (let i = 0; i < mutations.length; i++) mutBuf.push(mutations[i]);
        if (mutBuf.length > 200) mutBuf = mutBuf.slice(-80);
        if (!mutScheduled) {
          mutScheduled = true;
          requestAnimationFrame(flushMut);
        }
      }).observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ATTRS,
      });
    }

    const wrap = (fn) => function () {
      const ret = fn.apply(this, arguments);
      soccerExpanded = false;
      schedule("full");
      return ret;
    };
    history.pushState = wrap(history.pushState);
    history.replaceState = wrap(history.replaceState);
    window.addEventListener("popstate", () => schedule("full"));

    // very light periodic pass for SPA lazy content; no full body translate
    setInterval(() => schedule("light"), 4000);
  }

  if (document.body) boot();
  else window.addEventListener("DOMContentLoaded", boot);
})();
