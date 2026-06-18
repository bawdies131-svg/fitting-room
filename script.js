// ① URLパラメータから storeID を取得
const params = new URLSearchParams(window.location.search);
const storeId = params.get("store") || "default";
console.log("店舗ID:", storeId);

// ② Firebase からリアルタイムで waiting を読み込む
let waiting = [];

onValue(ref(db, `stores/${storeId}`), (snapshot) => {
    const data = snapshot.val();
    waiting = data || [];
    render();
});

// ③ Firebase に waiting を保存
function save() {
    set(ref(db, `stores/${storeId}`), waiting);
}

function render() {
    const reception = document.getElementById("reception");
    const waitingList = document.getElementById("waitingList");

    reception.innerHTML = "";
    waitingList.innerHTML = "";

    document.getElementById("waitingCount").textContent = waiting.length;

    // 使用中番号
    for (let i = 1; i <= 8; i++) {
        if (!waiting.includes(i)) {
            reception.innerHTML +=
                '<button class="number-button" onclick="addWaiting(' + i + ')">' +
                i +
                '</button>';
        }
    }

    // 待機中一覧
    if (waiting.length === 0) {
        waitingList.innerHTML =
            '<div class="empty">待機中のお客様はいません</div>';
    } else {
        waiting.forEach(function(number) {
            waitingList.innerHTML +=
                '<div class="card">' +
                '<div class="number">' + number + '番</div>' +
                '<button class="return-button" onclick="returnNumber(' + number + ')">番号札回収</button>' +
                '</div>';
        });
    }
}

function addWaiting(number) {
    if (confirm(number + "番で受付しますか？")) {
        waiting.push(number);
        save();
    }
}

function returnNumber(number) {
    if (confirm(number + "番の番号札を回収しますか？")) {
        waiting = waiting.filter(function(n) {
            return n !== number;
        });
        save();
    }
}

document.getElementById("resetButton").addEventListener("click", function() {
    if (confirm("全てのデータを削除しますか？")) {
        waiting = [];
        save();
    }
});

// 初期表示
render();
