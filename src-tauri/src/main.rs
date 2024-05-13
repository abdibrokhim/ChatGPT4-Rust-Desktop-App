#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest;
use serde_json::json;
// use tauri::Manager;
use tokio;

#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_completion, get_completion_image])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn get_completion(prompt: &str) -> Result<String, String> {
  println!("Prompt: {}", prompt);

  let client: reqwest::Client = reqwest::Client::new();
  let api_key: String = std::env::var("OPENAI_API_KEY").unwrap_or_else(|_| "".to_string());

  let payload: serde_json::Value = json!({
      "model": "gpt-4-turbo",
      "messages": [
          {
              "role": "user",
              "content": [
                  {
                      "type": "text",
                      "text": prompt
                  },
              ]
          }
      ],
      "max_tokens": 300
  });

  let url: &str = "https://api.openai.com/v1/chat/completions";
  let response: Result<_, _> = client.post(url)
      .header("Content-Type", "application/json")
      .header("Authorization", format!("Bearer {}", api_key))
      .body(json!(&payload).to_string())
      .send()
      .await;

  match response {
      Ok(resp) => {
          if resp.status().is_success() {
              resp.text().await.map_err(|e: reqwest::Error| e.to_string())
          } else {
              Err(format!("Failed to send request: {}", resp.status()))
          }
      },
      Err(e) => Err(e.to_string()),
  }
}


#[tauri::command]
async fn get_completion_image(prompt: &str, image_url: &str) -> Result<String, String> {
  println!("Prompt: {}", prompt);
  println!("Image URL: {}", image_url);

  let client: reqwest::Client = reqwest::Client::new();
  let api_key: String = std::env::var("OPENAI_API_KEY").unwrap_or_else(|_| "".to_string());

  let payload: serde_json::Value = json!({
      "model": "gpt-4-turbo",
      "messages": [
          {
              "role": "user",
              "content": [
                  {
                      "type": "text",
                      "text": prompt
                  },
                  {
                      "type": "image_url",
                      "image_url": {
                          "url": image_url
                      }
                  }
              ]
          }
      ],
      "max_tokens": 300
  });

  let url: &str = "https://api.openai.com/v1/chat/completions";
  let response: Result<_, _> = client.post(url)
      .header("Content-Type", "application/json")
      .header("Authorization", format!("Bearer {}", api_key))
      .body(json!(&payload).to_string())
      .send()
      .await;

  match response {
      Ok(resp) => {
          if resp.status().is_success() {
              resp.text().await.map_err(|e: reqwest::Error| e.to_string())
          } else {
              Err(format!("Failed to send request: {}", resp.status()))
          }
      },
      Err(e) => Err(e.to_string()),
  }
}