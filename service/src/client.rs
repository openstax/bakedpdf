use failure::Error;
use futures::prelude::*;
use lapin::channel::BasicProperties;
use std::io;

use message;

#[async]
pub fn send(uri: Vec<u8>) -> Result<(), Error> {
    let (channel, _) = await!(message::connect(false))?;

    let r = await!(channel.basic_publish("", "pdf", &uri, Default::default(), BasicProperties {
        // 2 = persistent, see https://www.rabbitmq.com/tutorials/tutorial-two-python.html
        delivery_mode: Some(2),
        ..BasicProperties::default()
    }))?;
    debug!("message delivered: {:?}", r);

    Ok(())
}
