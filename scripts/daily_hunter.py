#!/usr/bin/env python3
import argparse
import datetime as dt
import hashlib
import json
import os
from pathlib import Path
import random
import sys

ICLOUD_ARCHIVE_DIR = Path("/Users/chuangwen/Library/Mobile Documents/com~apple~CloudDocs/应用备份/LaughEveryDay/capsules")

SAMPLE_ONELINERS = [
    {
        "id": "hunter_yb_01",
        "category": "deadpan_oneliner",
        "type": "text",
        "title": "杨波经典：公共澡堂的见义勇为",
        "body": "小时候隔壁是公共女澡堂，我爸发现有人趴在墙上偷看，当场暴怒冲过去把那人暴揍一顿。\n那人被打得鼻青脸肿连连求饶，我爸扔掉棍子，面无表情地走到大树底下，抬头对着树杈喊：\n“波儿，下来吧，树上风大，回家喝汤了。”",
        "punchline": "——父亲的爱，永远那么深沉且有分寸。",
        "durationSec": 35,
        "authorOrSource": "脱口秀演员 杨波",
        "tags": ["杨波", "偷看洗澡", "神反转"]
    },
    {
        "id": "hunter_yb_02",
        "category": "deadpan_oneliner",
        "type": "text",
        "title": "杨波经典：海边救生员的沉着与冷静",
        "body": "我以前当过救生员。遇到有人溺水，我从来不慌张。\n我会拼尽全力游到那个人身边，拍拍他的肩膀安慰他：“兄弟别怕，我已经报警了，警察大概半小时就到。”",
        "punchline": "——“如果撑不到半小时，记得给我五星好评。”",
        "durationSec": 30,
        "authorOrSource": "脱口秀演员 杨波",
        "tags": ["杨波", "救生员", "冷面"]
    },
    {
        "id": "hunter_yb_03",
        "category": "deadpan_oneliner",
        "type": "text",
        "title": "杨波经典：深夜劫匪的职业困惑",
        "body": "那天走夜路遇到劫匪掏刀顶着我：“要钱还是要命？！”\n我想了想说：“要钱。”\n劫匪愣了：“你不怕死啊？”\n我说：“死倒不怕，主要是没钱。”",
        "punchline": "——劫匪最后塞给我二十块钱打车走了。",
        "durationSec": 30,
        "authorOrSource": "脱口秀演员 杨波",
        "tags": ["杨波", "劫匪", "大实话"]
    },
    {
        "id": "hunter_yb_04",
        "category": "deadpan_oneliner",
        "type": "text",
        "title": "杨波经典：关于吃苦的母子深情",
        "body": "小时候我妈天天摸着我的头说：“吃得苦中苦，方为人上人。”\n现在我人到中年，吃了无数的苦，我才终于明白：我妈是真的能吃苦，连这种鬼话都能编出来骗我三十年。",
        "punchline": "——母爱如山，山体滑坡。",
        "durationSec": 30,
        "authorOrSource": "脱口秀演员 杨波",
        "tags": ["杨波", "吃苦", "哲理"]
    },
    {
        "id": "hunter_yb_05",
        "category": "deadpan_oneliner",
        "type": "text",
        "title": "杨波经典：借钱的生存法则",
        "body": "三年前一个朋友管我借两万块钱，说下周一定还，现在三年过去了微信把我拉黑了。\n在这个寂静的深夜，我悟出了一个道理：人啊，千万别借钱给快要死的人。",
        "punchline": "——尤其是那种装死的人。",
        "durationSec": 30,
        "authorOrSource": "脱口秀演员 杨波",
        "tags": ["杨波", "借钱", "地狱笑话"]
    }
]

SAMPLE_IMAGES = [
    {
        "id": "hunter_img_01",
        "category": "deadpan_oneliner",
        "type": "image",
        "title": "《杨波双手插兜冷面现场》",
        "body": "面瘫三秒，包袱要命。只要我不笑，笑的就是全场观众。",
        "mediaUrl": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'><rect width='600' height='400' fill='%23141722'/><text x='300' y='200' fill='%23FFD93D' font-size='22' text-anchor='middle'>【杨波经典：波儿下来吧该回家喝汤了】</text></svg>",
        "punchline": "——脱口秀天花板节奏。",
        "durationSec": 60,
        "authorOrSource": "脱口秀名场面",
        "tags": ["插图", "神反转"]
    },
    {
        "id": "hunter_img_02",
        "category": "self_deprecation",
        "type": "image",
        "title": "《核心生产中台承重墙Bug》",
        "body": "整座高并发中台系统，全靠角落里一根用胶带粘着的废弃扫把支撑。",
        "mediaUrl": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'><rect width='600' height='400' fill='%231A1C23'/><text x='300' y='200' fill='%23FF6B6B' font-size='20' text-anchor='middle'>【谁修这个Bug明天全公司就得散伙】</text></svg>",
        "punchline": "——不可触碰的祖传代码。",
        "durationSec": 60,
        "authorOrSource": "硅谷工程现实",
        "tags": ["程序员", "神图"]
    },
    {
        "id": "hunter_img_03",
        "category": "visual_fails",
        "type": "image",
        "title": "《反人类直男施工队水龙头》",
        "body": "出水孔紧贴台盆内壁，每次洗手必须把手掌压扁成一张纸。",
        "mediaUrl": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'><rect width='600' height='400' fill='%2311131A'/><text x='300' y='200' fill='%234D96FF' font-size='20' text-anchor='middle'>【水龙头：离我太近算你骚扰】</text></svg>",
        "punchline": "——洗手洗出了拆弹专家的紧张感。",
        "durationSec": 60,
        "authorOrSource": "人类迷惑大赏",
        "tags": ["工程翻车", "真实抓拍"]
    }
]

SAMPLE_VIDEOS = [
    {
        "id": "hunter_vid_01",
        "category": "deadpan_oneliner",
        "type": "video",
        "title": "脱口秀视频精选：杨波《我那正义的父亲》",
        "body": "原汁原味现场实录，插兜冷面停顿3秒，包袱突发性反转。",
        "mediaUrl": "assets/yangbo_peeping.mp4",
        "durationSec": 150,
        "authorOrSource": "脱口秀大会精选",
        "tags": ["杨波", "舞台视频", "偷看洗澡"]
    },
    {
        "id": "hunter_vid_02",
        "category": "visual_fails",
        "type": "video",
        "title": "【高能抓拍】女学员的神级空间传送门倒车",
        "body": "教练：“往右打死……慢一点……你为什么把车倒进了鱼塘？！”",
        "mediaUrl": "assets/parking_fail.mp4",
        "durationSec": 120,
        "authorOrSource": "驾校监控实录",
        "tags": ["倒车", "迷惑行为"]
    },
    {
        "id": "hunter_vid_03",
        "category": "animal_chaos",
        "type": "video",
        "title": "【高萌暴击】猫咪被自己尾巴吓得原地垂直发射",
        "body": "正在舔毛的黑猫突然回头看到尾巴，全身炸毛原地火箭发射起飞。",
        "mediaUrl": "assets/cat_launch.mp4",
        "durationSec": 120,
        "authorOrSource": "猫咪迷惑行为",
        "tags": ["猫咪", "起飞", "治愈"]
    }
]


def assemble_capsule(date_str):
    texts = SAMPLE_ONELINERS[:5]
    images = SAMPLE_IMAGES[:3]
    videos = SAMPLE_VIDEOS[:2]
    all_items = texts + images + videos
    total_seconds = sum(item["durationSec"] for item in all_items)
    capsule = {
        "date": date_str,
        "title": f"{date_str} 每日开心胶囊 · 杨波冷面神反转专版",
        "totalDurationSec": total_seconds,
        "itemCount": len(all_items),
        "items": all_items,
        "generatedAt": dt.datetime.now().astimezone().isoformat(timespec="seconds")
    }
    return capsule


def main():
    parser = argparse.ArgumentParser(description="LaughEveryDay Daily Hunter Engine")
    parser.add_argument("--date", default=dt.date.today().isoformat(), help="Target capsule date (YYYY-MM-DD)")
    parser.add_argument("--archive", action="store_true", default=True, help="Archive immutable copy to iCloud")
    args = parser.parse_args()

    date_str = args.date
    capsule = assemble_capsule(date_str)
    payload = json.dumps(capsule, ensure_ascii=False, indent=2)

    root_dir = Path(__file__).resolve().parent.parent
    local_path = root_dir / "daily_capsule.json"
    local_path.write_text(payload + "\n", encoding="utf-8")
    print(f"本地今日胶囊已生成: {local_path} (时长: {capsule['totalDurationSec']}秒, 条数: {capsule['itemCount']})")

    if args.archive:
        ICLOUD_ARCHIVE_DIR.mkdir(parents=True, exist_ok=True)
        archive_path = ICLOUD_ARCHIVE_DIR / f"capsule-{date_str}.json"
        archive_path.write_text(payload + "\n", encoding="utf-8")
        checksum = hashlib.sha256(payload.encode("utf-8")).hexdigest()
        print(f"iCloud不可变快照已同步: {archive_path}")
        print(f"SHA256指纹: {checksum}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
