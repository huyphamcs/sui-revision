/*
/// Module: hello_move
module hello_move::hello_move;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions


module hello_move::hello_move;

use std::string::{Self, String};

/// An object that contains an arbitrary string
public struct Huyphamcs has key, store {
    id: UID,
    /// A string contained in the object
    text: String,
}

#[lint_allow(self_transfer)]
public entry fun hello_move(ctx: &mut TxContext) {
    let object = Huyphamcs {
        id: object::new(ctx),
        text: string::utf8(b"Hello World Sui! I'm Anderson"),
    };
    transfer::public_transfer(object, tx_context::sender(ctx));
}

#[test_only]
public fun get_text(hello: &Huyphamcs): String {
    hello.text
}