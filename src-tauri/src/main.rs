// AIsary — par Toky Rakotomalala
// Copyright (C) 2026 Toky Rakotomalala — GPL-3.0-or-later
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("AIsary n'a pas pu démarrer");
}
