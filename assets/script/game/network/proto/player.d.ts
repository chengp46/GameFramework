import * as $protobuf from "protobufjs";
import Long = require("long");
/** Properties of a Player. */
export interface IPlayer {

    /** Player name */
    name?: (string|null);

    /** Player level */
    level?: (number|null);
}

/** Represents a Player. */
export class Player implements IPlayer {

    /**
     * Constructs a new Player.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPlayer);

    /** Player name. */
    public name: string;

    /** Player level. */
    public level: number;

    /**
     * Creates a new Player instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Player instance
     */
    public static create(properties?: IPlayer): Player;

    /**
     * Encodes the specified Player message. Does not implicitly {@link Player.verify|verify} messages.
     * @param message Player message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPlayer, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Player message, length delimited. Does not implicitly {@link Player.verify|verify} messages.
     * @param message Player message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPlayer, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Player message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Player
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Player;

    /**
     * Decodes a Player message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Player
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Player;

    /**
     * Verifies a Player message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Player message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Player
     */
    public static fromObject(object: { [k: string]: any }): Player;

    /**
     * Creates a plain object from a Player message. Also converts values to other types if specified.
     * @param message Player
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Player, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Player to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Player
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}
