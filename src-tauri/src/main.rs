#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest;
use serde_json::json;
use tauri::Builder;
use std::env;
use dotenv::dotenv;

fn main() {
    Builder::default()
        .invoke_handler(tauri::generate_handler![get_completion])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn get_completion(prompt: &str, key: &str) -> Result<String, String> {
    println!("Prompt: {}", prompt);

    dotenv().ok(); // Load environment variables from .env file
    let client = reqwest::Client::new();
    // let api_key = env::var("OPENAI_API_KEY").map_err(|_| "API key not set".to_string())?;
    let api_key = key;

    let payload = json!({
        "model": "gpt-4o",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "max_tokens": 300
    });

    let url = "https://api.openai.com/v1/chat/completions";
    let response = client.post(url)
        .header("Content-Type", "application/json")
        .header("Authorization", format!("Bearer {}", api_key))
        .body(payload.to_string())
        .send()
        .await;

    match response {
        Ok(resp) => {
            if resp.status().is_success() {
                resp.text().await.map_err(|e| e.to_string())
            } else {
                Err(format!("Failed to send request: {}", resp.status()))
            }
        },
        Err(e) => Err(e.to_string()),
    }
}


// #[tauri::command]
// async fn get_completion_image(prompt: &str, image_url: &str) -> Result<String, String> {
//   println!("Prompt: {}", prompt);
//   println!("Image URL: {}", image_url);

//   let client: reqwest::Client = reqwest::Client::new();
//   let api_key: String = std::env::var("OPENAI_API_KEY").unwrap_or_else(|_| "".to_string());

//   let payload: serde_json::Value = json!({
//       "model": "gpt-4-turbo",
//       "messages": [
//           {
//               "role": "user",
//               "content": [
//                   {
//                       "type": "text",
//                       "text": prompt
//                   },
//                   {
//                       "type": "image_url",
//                       "image_url": {
//                           "url": image_url
//                       }
//                   }
//               ]
//           }
//       ],
//       "max_tokens": 300
//   });

//   let url: &str = "https://api.openai.com/v1/chat/completions";
//   let response: Result<_, _> = client.post(url)
//       .header("Content-Type", "application/json")
//       .header("Authorization", format!("Bearer {}", api_key))
//       .body(json!(&payload).to_string())
//       .send()
//       .await;

//   match response {
//       Ok(resp) => {
//           if resp.status().is_success() {
//               resp.text().await.map_err(|e: reqwest::Error| e.to_string())
//           } else {
//               Err(format!("Failed to send request: {}", resp.status()))
//           }
//       },
//       Err(e) => Err(e.to_string()),
//   }
// }