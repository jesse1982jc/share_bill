import { useState } from "react";
import "./index.css";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

export default function App() {
  // 設定一個 friend list 的陣列，裡面有很多 friend object 的屬性，預設為 initialFriends
  const [friends, setFriends] = useState(initialFriends);

  // 新增 useState，判斷是否顯示 加入朋友 的表單 form，預設為 false
  const [showAddFriend, setShowAddFriend] = useState(false);

  // 新增 useState，判斷目前選擇的 要 share 的 friend 的人是誰，預設是 null
  // null 表示: 不顯示右半邊的 form，不然有 friend 時，就顯示該 friend 的 form
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleShowFriend = () => {
    // 注意: 這裡的寫法不熟，要多練習，就是用 arrow function 建立一個 currShow，然後改變反向狀態
    setShowAddFriend((currShow) => !currShow);
  };

  // 新增 split friend info
  // handleAddFriend 函式裡的參數，直接帶入 friend 物件，friend 本身有 id, name, image, balance 屬性
  const handleAddFriend = (friend) => {
    setFriends((currFriends) => {
      return [...currFriends, friend];
    });

    // 把 新增 朋友分攤的表單關閉
    setShowAddFriend(false);
  };

  // 處理選擇哪一個 friend 來 share 費用
  const handleSelection = (friend) => {
    // setSelectedFriend(friend);
    setSelectedFriend((currSelectedFriend) =>
      currSelectedFriend?.id === friend.id ? null : friend
    );

    // 把 新增 朋友分攤的表單關閉
    setShowAddFriend(false);
  };

  // 處理 分擔帳單費用
  // 這段邏輯看不太懂
  // 更新左半邊誰欠誰多少錢? 紅字 or 綠字
  const handleSplitBill = (value) => {
    console.log(value);

    setFriends((currFriends) =>
      currFriends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    // 清空右半邊的分擔費用的表單
    setSelectedFriend(null);
  };

  return (
    <div className="app">
      <div className="sidebar">
        {/* friend list 如果有 friend 被選擇到，就執行 handleSelection */}
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />

        {/* showAddFriend 是 true 就渲染 FormAddFriend 組件 */}
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        {/* Add Friend 這個按鈕是 children prop，所以有 closing tag */}
        {/* 用三元運算子來渲染按鈕要顯示什麼文字 */}
        <Button onClick={handleShowFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>

      {/* selectedFriend 是 truthy 才渲染 FormSplitBill 組件 */}
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, selectedFriend, onSelection }) {
  // FriendsList 是 ul 底下，所有 list 項目的 組件

  return (
    <ul>
      {friends.map((friend) => {
        return (
          <Friend
            key={friend.id}
            friend={friend}
            selectedFriend={selectedFriend}
            onSelection={onSelection}
          />
        );
      })}
    </ul>
  );
}

function Friend({ friend, selectedFriend, onSelection }) {
  // 新增一個變數，判斷被選取的 friend 是否為當前的 friend，是 boolean 值
  // 利用 optional chain 可選鍊，當 selectedFriend 有值時，再解析 id
  const isSelected = selectedFriend?.id === friend.id;

  // Friend 是 li 底下的單個 item 的 組件

  return (
    <div>
      <li className={isSelected ? "selected" : ""}>
        <img src={friend.image} alt={friend.name} />
        <h3>{friend.name}</h3>

        {/* 判斷 balance 為正負值，顯示不同顏色的文字 */}
        {/* {balance < 0 顯示紅字} */}
        {friend.balance < 0 && (
          <p className="red">
            You owe {friend.name} {Math.abs(friend.balance)}€
          </p>
        )}

        {/* balance > 0 顯示綠字 */}
        {friend.balance > 0 && (
          <p className="green">
            {friend.name} owes you {Math.abs(friend.balance)}€
          </p>
        )}

        {/* balance = 0 顯示黑字 */}
        {friend.balance === 0 && <p>You and {friend.name} are even</p>}

        {/* 子元素 children prop 要記得用 closing tag */}
        {/* Select 會指向 {children} */}
        <Button onClick={() => onSelection(friend)}>
          {isSelected ? "Close" : "Select"}
        </Button>
      </li>
    </div>
  );
}

function FormAddFriend({ onAddFriend }) {
  // 設定 Friend Name 及 Friend Image 的 useState
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  const handleSubmit = (e) => {
    // 防止表單預設送出
    e.preventDefault();

    // 假如 name 或 image 欄位有空的，就不做新增的動作
    if (!name || !image) return;

    // 建一個隨機 id
    const id = crypto.randomUUID();

    // 新增 Friend name 及 Friend image 等等的資訊
    const newFriend = { id, name, image: `${image}?u=${id}`, balance: 0 };

    // 新增 split friend 的資料
    onAddFriend(newFriend);

    // 清空 Friend Name 及 Friend Image，還原成初始值
    setName("");
    setImage("https://i.pravatar.cc/48");
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="form-add-friend">
        <label>👉 Friend name</label>
        <input
          onChange={(e) => setName(e.target.value)}
          type="text"
          value={name}
        />

        <label>📷 Image URL</label>
        <input
          onChange={(e) => setImage(e.target.value)}
          type="text"
          value={image}
        />

        {/* 記得 Button 是子元素，有 closing tag */}
        <Button>Add</Button>
      </form>
    </div>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  const handleSubmit = (e) => {
    // 防止表單預設送出
    e.preventDefault();

    // 假如 bill 或 paidByUser 是空的，就什麼事也不做
    if (!bill || !paidByUser) return;

    // 這段看不懂，計算要怎麼分帳
    // 如果帳單是 自己付，那就丟回「朋友欠你的錢」，如果帳單是 朋友付，那就丟回「你欠朋友的錢」(前面加個 - 負數)
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  };

  return (
    <form onSubmit={handleSubmit} className="form-split-bill">
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💵 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧑 Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>👯 {selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>💰 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
