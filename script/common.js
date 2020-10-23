// 기본 초기화
var init = false;
var myCanvas;
var Context;

// 게임 상태변수들
var Mode = 1;
const MODE_GAME = 1;
const MODE_GAMEOVER = 2;

// 테트리스 박스 크기
var tetrix_blockbox_boxsize = 25;
var tetrix_blockbox_top = 50;
var tetrix_blockbox_left = 280;

// tetrix_blockbox[row][col]; 20행 10열
var tetrix_blockbox;

// 점수
var score;

// 블럭이 내려오는 속도
var RunEvent;
var RunEventTime = 500;
var level = 1;
var exp = 0;

// 배경 이미지
var bgImage = new Image();

// 테트리스 블럭박스 초기화
function tetrix_blockbox_init() {
	// 20행 10열의 박스 생성
	tetrix_blockbox = new Array();
	for (i = 0; i < 20; ++i) {
		tetrix_blockbox.push(new Array(10));
		// 모두 0으로 채운다
		for (j = 0; j < 10; ++j)tetrix_blockbox[i][j] = 0;
	}
}

// 블록 타입 정의
var tetrix_block;

// 현재 사용중인 블록
var tetrix_block_this;

// 블록 타입 초기화
function tetrix_block_init() {
	tetrix_block = new Array();

	// 첫 블록
	// I 블록
	tmp = new Array();
	tmp.push(0, 0);
	tmp.push(0, 1);
	tmp.push(0, 2);
	tmp.push(0, 3);
	tetrix_block.push(tmp);

	// 두번째 불록
	// T블록
	tmp = new Array();
	tmp.push(1, 0);
	tmp.push(1, 1);
	tmp.push(1, 2);
	tmp.push(0, 1);
	tetrix_block.push(tmp);

	// 세번째 블록
	// z블록
	tmp = new Array();
	tmp.push(0, 0);
	tmp.push(0, 1);
	tmp.push(1, 1);
	tmp.push(1, 2);
	tetrix_block.push(tmp);

	// 네번째 블록
	// s블록
	tmp = new Array();
	tmp.push(0, 1);
	tmp.push(0, 2);
	tmp.push(1, 0);
	tmp.push(1, 1);
	tetrix_block.push(tmp);

	// 다섯번째 블록
	// o 블록
	tmp = new Array();
	tmp.push(0, 0);
	tmp.push(0, 1);
	tmp.push(1, 0);
	tmp.push(1, 1);
	tetrix_block.push(tmp);

	// 여섯번째 블록
	// l 블록
	tmp = new Array();
	tmp.push(0, 2);
	tmp.push(1, 0);
	tmp.push(1, 1);
	tmp.push(1, 2);
	tetrix_block.push(tmp);

	// 일곱번째 블록
	// j블록
	tmp = new Array();
	tmp.push(0, 0);
	tmp.push(1, 0);
	tmp.push(1, 1);
	tmp.push(1, 2);
	tetrix_block.push(tmp);
}

// 현재 떨어지는 블록번호와 좌표
var tetrix_block_num = 1;
var tetrix_block_x = 3;
var tetrix_block_y = 0;

// 초기화
function Init() {
	if (init == false) {
		myCanvas = document.getElementById("MyCanvas");
		Context = myCanvas.getContext("2d");
		tetrix_block_init();	// 5가지 블럭 모양 초기화
		tetrix_blockbox_init();	// 블럭상자 초기화
		tetrix_block_number = Math.floor(Math.random() * 6.9);
		tetrix_block_this = tetrix_block[tetrix_block_number].slice();
		score = 0;
		init = true;
	}
}

// 충돌 판정 함수
function CheckConflict() {
	var size = tetrix_block_this.length;
	for (k = 0; k < size; k += 2) {
		check_y = tetrix_block_y + tetrix_block_this[k];
		check_x = tetrix_block_x + tetrix_block_this[k + 1];
		if (check_y < 0) continue;	// y좌표가 0보다 적은 사각형은 중돌 검사를 안함
		// 겹치는 경우
		if (check_x < 0 || check_x >= 10 || check_y >= 20 || tetrix_blockbox[check_y][check_x] != 0) return true;
	}
	return false;
}

function Run() {
	// 게임오버
	if (CheckConflict())
		Mode = MODE_GAMEOVER;
	if (Mode == MODE_GAME) {
		// 블럭을 한칸 떨어뜨리고
		tetrix_block_y++;
		// 겹침검사	
		if (CheckConflict()) {
			// 다시 위로 이동시킨 다음
			tetrix_block_y--;
			var size = tetrix_block_this.length;
			// 블럭을 블럭판에 박는다
			for (k = 0; k < size; k += 2) {
				check_y = tetrix_block_y + tetrix_block_this[k];
				check_x = tetrix_block_x + tetrix_block_this[k + 1];
				tetrix_blockbox[check_y][check_x] = 1;
			}

			// 꽉참 줄 검사
			for (i = 0; i < 20; ++i) {
				// 한줄 단위로 0이 아닌 블럭을 세서 
				sum = 0;
				for (j = 0; j < 10; ++j)
					if (tetrix_blockbox[i][j] != 0)
						sum++;

				// 합계가 10이면 꽉찬 것
				if (sum == 10) {
					// 위의 내용을 아래로 복사해준다.
					for (k = i; k > 0; --k)
						for (j = 0; j < 10; ++j)
							tetrix_blockbox[k][j] = tetrix_blockbox[k - 1][j];
					score += 10;

					// 난이도 레벨을 증가시키기 위해 경험치 증가
					exp++;
					if (exp >= 10) {
						level++; exp = 0;
						RunEventTime -= 50;
						clearInterval(RunEvent);
						RunEvent = setInterval(Run, RunEventTime);
					}

				}
			}

			// 블럭을 다시 제일 위로 생성시키고
			tetrix_block_y = 0;
			// 블럭이 생성되는 x 좌표
			tetrix_block_x = 3;
			// 블럭번호도 바꿔 주자
			tetrix_block_num = Math.floor(Math.random() * 6.9);
			tetrix_block_this = tetrix_block[tetrix_block_num].slice();
		}
	}

	// 그리기 이벤트
	onDraw();
}

// 블럭 회전하는 부분
function RotateBlock() {
	switch (tetrix_block_num) {
		case 0: case 1: case 2: case 3:
			// 첫번째 블럭
			// □□□□
			// 두번째 블럭
			// □□□
			//  □
			// 세번째 블럭
			// □□
			//  □□
			// 네번째 블럭
			//  □□
			// □□
			centerY = 0; centerX = 1;	// ( 0, 1 ) 지점을 중심
			break;
		case 4:
			// 다섯번째 블럭
			// □□
			// □□
			return;
		case 5: case 6:
			centerY = 0; centerX = 1;	// ( 0, 1 ) 지점을 중심
			break;
	}

	// 회전
	// x ← -y
	// y ← x
	// 이전 형태를 미리 기억
	tetrix_block_save = tetrix_block_this.slice();
	for (i = 0; i < tetrix_block_this.length; i += 2) {
		y = tetrix_block_this[i + 1] - centerX;
		x = -(tetrix_block_this[i] - centerY);
		tetrix_block_this[i] = y + centerY;
		tetrix_block_this[i + 1] = x + centerX;
	}

	// 충돌인 경우 원상복귀
	if (CheckConflict())
		tetrix_block_this = tetrix_block_save.slice();
}

// 키 입력 부분
function onKeyDown(event) {
	// 게임중일 때만 이동 회전키가 작동
	if (Mode == MODE_GAME) {
		if (event.which == 32) { // 스페이스키(바닥에 붙음)
			tetrix_block_y += 20;
			if (CheckConflict()) {
				while (CheckConflict())
					tetrix_block_y--;
			}
			else onDraw();
		}
		if (event.which == 37) { // 화살표 왼쪽키(왼쪽으로 이동)
			tetrix_block_x--;
			if (CheckConflict())
				tetrix_block_x++;
			else onDraw();
		}
		if (event.which == 39) { // 화살표 오른쪽키(오른쪽으로 이동)
			tetrix_block_x++;
			if (CheckConflict())
				tetrix_block_x--;
			else onDraw();
		}
		if (event.which == 40) { // 화살표 아래키(아래로 한칸씩)
			tetrix_block_y++;
			if (CheckConflict())
				tetrix_block_y--;
			else onDraw();
		}
		if (event.which == 38) { // 화살표 위쪽(회전)
			RotateBlock();
			onDraw();
		}
	}
	if (Mode == MODE_GAMEOVER) { // 게임 오버일때
		if (event.which == 13) { // Enter키(재시작)
			// 게임 재시작
			tetrix_blockbox_init();	// 블럭상자 초기화
			tetrix_block_number = Math.floor(Math.random() * 6.9);
			tetrix_block_this = tetrix_block[tetrix_block_number].slice();
			score = 0;
			Mode = MODE_GAME;
		}
	}
}

// draw 이벤트
function onDraw() {
	if (init == false) return;
	// 전체 테두리
	Context.strokeStyle = "#000";
	Context.lineWidth = 1;
	Context.strokeRect(0, 0, myCanvas.width - 1, myCanvas.height - 1);
	// 블럭 표시
	for (i = 0; i < 20; ++i)
		for (j = 0; j < 10; ++j) {
			if (tetrix_blockbox[i][j] == 0)
				Context.fillStyle = "#ccc";
			else
				Context.fillStyle = "green";

			// 떨어지는 블럭표시
			var size = tetrix_block_this.length;
			for (k = 0; k < size; k += 2) {
				if (tetrix_block_y + tetrix_block_this[k] == i
					&& tetrix_block_x + tetrix_block_this[k + 1] == j)
					Context.fillStyle = "blue";
			}

			x = tetrix_blockbox_left + j * tetrix_blockbox_boxsize;
			y = tetrix_blockbox_top + i * tetrix_blockbox_boxsize;
			Context.fillRect(x, y, tetrix_blockbox_boxsize - 2, tetrix_blockbox_boxsize - 2);
		}

	// 점수 표시
	Context.font = "30px 나눔고딕";
	Context.fillStyle = "#eee";
	Context.fillRect(10, 60, 250, 40);
	Context.fillRect(10, 120, 250, 40);
	Context.fillStyle = "blue";
	Context.fillText("Score " + score, 50, 90);
	Context.fillText("Level " + level, 50, 150);

	if (Mode == MODE_GAMEOVER) {
		Context.fillStyle = "red";
		Context.fillText("GAME OVER", tetrix_blockbox_left + 40, tetrix_blockbox_top + 250);
	}
}

$(document).ready(function () {
	Init();
	RunEvent = setInterval(Run, RunEventTime);
});
$(document).keydown(function (event) {
	onKeyDown(event);
});