import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	let sessionTime: number = 0;
	let lastWindowFocus = Date.now();

	let shouldCount: boolean = vscode.window.state.focused;

	let currentSessionTimeItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
	currentSessionTimeItem.show();

	const updateSesstionTime = () => {
		if (shouldCount) {
			const now = Date.now();
			sessionTime += now - lastWindowFocus;
			lastWindowFocus = now;
		}
	}


	const interval = setInterval(() => {
		updateSesstionTime();
		currentSessionTimeItem.text = (sessionTime / 1000).toFixed(0) + ' seconds';
	}, 1000);


	const onFocusChange = vscode.window.onDidChangeWindowState((e) => {
		shouldCount = e.focused;
		if (e.focused) {
			lastWindowFocus = Date.now();
		} else {
			sessionTime += Date.now() - lastWindowFocus;
		}
	})

	const onDispose = new vscode.Disposable(() => {
		clearInterval(interval);
	})


	context.subscriptions.push(onDispose, onFocusChange);
}