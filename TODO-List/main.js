const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        fullscreen: true,
        kiosk: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        autoHideMenuBar: true // Скрывает строку меню
    });

    mainWindow.loadFile('index.html');

    // Отслеживаем событие закрытия окна (если пользователь попытается закрыть окно другим способом)
    mainWindow.on('closed', () => {
        mainWindow = null; // Очищаем ссылку на окно
        app.quit();       // Закрываем приложение
    });

    // Отключаем сочетания клавиш для масштабирования (Ctrl/Cmd + +/-)
    mainWindow.webContents.on('before-input-event', (event, input) => {
        if (input.type === 'keyDown') {
            // Проверяем нажатие клавиш Ctrl или Cmd (в зависимости от платформы)
            const isZoomKey = (process.platform === 'darwin' ? input.meta : input.control) &&
                (input.key === '+' || input.key === '-' || input.key === '='); // = is for '+' on some layouts

            if (isZoomKey) {
                event.preventDefault();
            }
        }
    });

    // Устанавливаем фиксированный Zoom Factor (1.0 - нормальный размер)
    mainWindow.webContents.setZoomFactor(1.0);

    // Или, можно установить Zoom Level
    // mainWindow.webContents.setZoomLevel(0); // 0 corresponds to 100% zoom

}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Обработчик сообщения для закрытия приложения
ipcMain.on('close-app', () => {
    mainWindow.close(); // Закрываем окно
});
