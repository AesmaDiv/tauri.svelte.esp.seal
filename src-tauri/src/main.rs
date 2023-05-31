// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

pub mod commands;
pub mod database;
pub mod hardware;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::logging,
            commands::file_exists,
            commands::read_adam,
            commands::read_testlist,
            commands::read_record,
            commands::read_dictionary,
            commands::read_types,
            commands::write_adam,
            commands::write_record,
            commands::write_dictionary,
            commands::delete_record,
            commands::delete_dictionary
          ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
