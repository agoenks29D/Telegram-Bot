import {
  withPhotoMessage,
  withVoiceMessage,
  withVideoMessage,
  withDocumentMessage,
  withLocationMessage,
  withPollMessage,
  withContactMessage,
  withStickerMessage,
  withTextMessage,
  withAdminOnly,
  withChatType,
} from '../filters';
import { MyContext } from '@/types';

/**
 * Loose override type so partial mock objects don't conflict with
 * Telegraf's strict discriminated unions (e.g. GroupChat requires `title`,
 * PhotoMessage requires `edit_date` for the Edited variant, etc.).
 * We cast through `unknown` at the boundary so TypeScript doesn't complain
 * about structurally incomplete mocks — the runtime behaviour is what matters.
 */
type MockOverrides = Record<string, unknown>;

/**
 * Creates a minimal mock MyContext. All overrides are accepted as a plain
 * Record so callers don't have to satisfy Telegraf's full discriminated-union
 * types just to stub a single field.
 */
function createMockCtx(overrides: MockOverrides = {}): MyContext {
  const base: MockOverrides = {
    msg: undefined,
    update: {},
    chat: undefined,
    from: undefined,
    reply: jest.fn().mockResolvedValue({}),
    getChatMember: jest.fn(),
    botInfo: { username: 'TestBot' },
  };

  return { ...base, ...overrides } as unknown as MyContext;
}

const mockNext = jest.fn().mockResolvedValue(undefined);

beforeEach(() => {
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// withPhotoMessage
// ---------------------------------------------------------------------------
describe('withPhotoMessage', () => {
  it('should call handler when message contains a photo', async () => {
    const handler = jest.fn().mockResolvedValue(undefined);
    const middleware = withPhotoMessage(handler);
    const ctx = createMockCtx({ msg: { photo: [] } });

    await middleware(ctx, mockNext);

    expect(handler).toHaveBeenCalledWith(ctx, mockNext);
    expect(ctx.reply).not.toHaveBeenCalled();
  });

  it('should reply when message does not contain a photo', async () => {
    const handler = jest.fn();
    const middleware = withPhotoMessage(handler);
    const ctx = createMockCtx({ msg: { text: 'hello' } });

    await middleware(ctx, mockNext);

    expect(handler).not.toHaveBeenCalled();
    expect(ctx.reply).toHaveBeenCalledWith('Please send a photo.');
  });
});

// ---------------------------------------------------------------------------
// withVoiceMessage
// ---------------------------------------------------------------------------
describe('withVoiceMessage', () => {
  it('should call handler when message contains a voice note', async () => {
    const handler = jest.fn().mockResolvedValue(undefined);
    const middleware = withVoiceMessage(handler);
    const ctx = createMockCtx({ msg: { voice: {} } });

    await middleware(ctx, mockNext);

    expect(handler).toHaveBeenCalledWith(ctx, mockNext);
  });

  it('should reply when message does not contain a voice note', async () => {
    const handler = jest.fn();
    const middleware = withVoiceMessage(handler);
    const ctx = createMockCtx({ msg: { text: 'hello' } });

    await middleware(ctx, mockNext);

    expect(ctx.reply).toHaveBeenCalledWith('Please send a voice message.');
  });
});

// ---------------------------------------------------------------------------
// withVideoMessage
// ---------------------------------------------------------------------------
describe('withVideoMessage', () => {
  it('should call handler when message contains a video', async () => {
    const handler = jest.fn().mockResolvedValue(undefined);
    const middleware = withVideoMessage(handler);
    const ctx = createMockCtx({ msg: { video: {} } });

    await middleware(ctx, mockNext);

    expect(handler).toHaveBeenCalledWith(ctx, mockNext);
  });

  it('should reply when message does not contain a video', async () => {
    const handler = jest.fn();
    const middleware = withVideoMessage(handler);
    const ctx = createMockCtx({ msg: {} });

    await middleware(ctx, mockNext);

    expect(ctx.reply).toHaveBeenCalledWith('Please send a video.');
  });
});

// ---------------------------------------------------------------------------
// withDocumentMessage
// ---------------------------------------------------------------------------
describe('withDocumentMessage', () => {
  it('should call handler when message contains a document', async () => {
    const handler = jest.fn().mockResolvedValue(undefined);
    const middleware = withDocumentMessage(handler);
    const ctx = createMockCtx({ msg: { document: {} } });

    await middleware(ctx, mockNext);

    expect(handler).toHaveBeenCalledWith(ctx, mockNext);
  });

  it('should reply when message does not contain a document', async () => {
    const handler = jest.fn();
    const middleware = withDocumentMessage(handler);
    const ctx = createMockCtx({ msg: {} });

    await middleware(ctx, mockNext);

    expect(ctx.reply).toHaveBeenCalledWith('Please send a document file.');
  });
});

// ---------------------------------------------------------------------------
// withLocationMessage
// ---------------------------------------------------------------------------
describe('withLocationMessage', () => {
  it('should call handler when message contains a location', async () => {
    const handler = jest.fn().mockResolvedValue(undefined);
    const middleware = withLocationMessage(handler);
    const ctx = createMockCtx({ msg: { location: { latitude: 0, longitude: 0 } } });

    await middleware(ctx, mockNext);

    expect(handler).toHaveBeenCalledWith(ctx, mockNext);
  });

  it('should reply when message does not contain a location', async () => {
    const handler = jest.fn();
    const middleware = withLocationMessage(handler);
    const ctx = createMockCtx({ msg: {} });

    await middleware(ctx, mockNext);

    expect(ctx.reply).toHaveBeenCalledWith('Please share your location.');
  });
});

// ---------------------------------------------------------------------------
// withPollMessage
// ---------------------------------------------------------------------------
describe('withPollMessage', () => {
  it('should call handler when update contains a poll', async () => {
    const handler = jest.fn().mockResolvedValue(undefined);
    const middleware = withPollMessage(handler);
    const ctx = createMockCtx({ update: { poll: {} } });

    await middleware(ctx, mockNext);

    expect(handler).toHaveBeenCalledWith(ctx, mockNext);
  });

  it('should reply when update does not contain a poll', async () => {
    const handler = jest.fn();
    const middleware = withPollMessage(handler);
    const ctx = createMockCtx({ update: { message: {} } });

    await middleware(ctx, mockNext);

    expect(ctx.reply).toHaveBeenCalledWith('Please send a poll.');
  });
});

// ---------------------------------------------------------------------------
// withContactMessage
// ---------------------------------------------------------------------------
describe('withContactMessage', () => {
  it('should call handler when message contains a contact', async () => {
    const handler = jest.fn().mockResolvedValue(undefined);
    const middleware = withContactMessage(handler);
    const ctx = createMockCtx({ msg: { contact: {} } });

    await middleware(ctx, mockNext);

    expect(handler).toHaveBeenCalledWith(ctx, mockNext);
  });

  it('should reply when message does not contain a contact', async () => {
    const handler = jest.fn();
    const middleware = withContactMessage(handler);
    const ctx = createMockCtx({ msg: {} });

    await middleware(ctx, mockNext);

    expect(ctx.reply).toHaveBeenCalledWith('Please share a contact.');
  });
});

// ---------------------------------------------------------------------------
// withStickerMessage
// ---------------------------------------------------------------------------
describe('withStickerMessage', () => {
  it('should call handler when message contains a sticker', async () => {
    const handler = jest.fn().mockResolvedValue(undefined);
    const middleware = withStickerMessage(handler);
    const ctx = createMockCtx({ msg: { sticker: {} } });

    await middleware(ctx, mockNext);

    expect(handler).toHaveBeenCalled();
  });

  it('should reply when message does not contain a sticker', async () => {
    const handler = jest.fn();
    const middleware = withStickerMessage(handler);
    const ctx = createMockCtx({ msg: {} });

    await middleware(ctx, mockNext);

    expect(ctx.reply).toHaveBeenCalledWith('Please send a sticker.');
  });
});

// ---------------------------------------------------------------------------
// withTextMessage
// ---------------------------------------------------------------------------
describe('withTextMessage', () => {
  it('should call handler when message contains text', async () => {
    const handler = jest.fn().mockResolvedValue(undefined);
    const middleware = withTextMessage(handler);
    const ctx = createMockCtx({ msg: { text: 'hello world' } });

    await middleware(ctx, mockNext);

    expect(handler).toHaveBeenCalled();
  });

  it('should reply when message does not contain text', async () => {
    const handler = jest.fn();
    const middleware = withTextMessage(handler);
    const ctx = createMockCtx({ msg: { photo: [] } });

    await middleware(ctx, mockNext);

    expect(ctx.reply).toHaveBeenCalledWith('Please respond with text.');
  });
});

// ---------------------------------------------------------------------------
// withAdminOnly
// ---------------------------------------------------------------------------
describe('withAdminOnly', () => {
  it('should reply with group-only message when chat is private', async () => {
    const handler = jest.fn();
    const middleware = withAdminOnly(handler);
    const ctx = createMockCtx({ chat: { type: 'private' } });

    await middleware(ctx, mockNext);

    expect(ctx.reply).toHaveBeenCalledWith('This command can only be used in group chats.');
    expect(handler).not.toHaveBeenCalled();
  });

  it('should reply when chat is undefined', async () => {
    const handler = jest.fn();
    const middleware = withAdminOnly(handler);
    const ctx = createMockCtx({ chat: undefined });

    await middleware(ctx, mockNext);

    expect(ctx.reply).toHaveBeenCalledWith('This command can only be used in group chats.');
  });

  it('should call handler when user is a group administrator', async () => {
    const handler = jest.fn().mockResolvedValue(undefined);
    const middleware = withAdminOnly(handler);
    const ctx = createMockCtx({
      chat: { type: 'group', id: 1, title: 'Test Group' },
      from: { id: 42, is_bot: false, first_name: 'Test' },
      getChatMember: jest.fn().mockResolvedValue({ status: 'administrator' }),
    });

    await middleware(ctx, mockNext);

    expect(handler).toHaveBeenCalledWith(ctx, mockNext);
  });

  it('should call handler when user is the group creator', async () => {
    const handler = jest.fn().mockResolvedValue(undefined);
    const middleware = withAdminOnly(handler);
    const ctx = createMockCtx({
      chat: { type: 'group', id: 1, title: 'Test Group' },
      from: { id: 42, is_bot: false, first_name: 'Test' },
      getChatMember: jest.fn().mockResolvedValue({ status: 'creator' }),
    });

    await middleware(ctx, mockNext);

    expect(handler).toHaveBeenCalledWith(ctx, mockNext);
  });

  it('should reply when user is a regular member', async () => {
    const handler = jest.fn();
    const middleware = withAdminOnly(handler);
    const ctx = createMockCtx({
      chat: { type: 'group', id: 1, title: 'Test Group' },
      from: { id: 42, is_bot: false, first_name: 'Test' },
      getChatMember: jest.fn().mockResolvedValue({ status: 'member' }),
    });

    await middleware(ctx, mockNext);

    expect(ctx.reply).toHaveBeenCalledWith('You must be an admin to use this command.');
    expect(handler).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// withChatType
// ---------------------------------------------------------------------------
describe('withChatType', () => {
  it('should call handler when chat type matches', async () => {
    const handler = jest.fn().mockResolvedValue(undefined);
    const middleware = withChatType(['private'], handler);
    const ctx = createMockCtx({ chat: { type: 'private', id: 1 } });

    await middleware(ctx, mockNext);

    expect(handler).toHaveBeenCalledWith(ctx, mockNext);
  });

  it('should call next when chat type does not match', async () => {
    const handler = jest.fn();
    const middleware = withChatType(['private'], handler);
    const ctx = createMockCtx({ chat: { type: 'group', id: 1, title: 'Test' } });

    await middleware(ctx, mockNext);

    expect(handler).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });

  it('should call handler when chat type is one of multiple allowed types', async () => {
    const handler = jest.fn().mockResolvedValue(undefined);
    const middleware = withChatType(['group', 'supergroup'], handler);
    const ctx = createMockCtx({ chat: { type: 'supergroup', id: 1, title: 'Test' } });

    await middleware(ctx, mockNext);

    expect(handler).toHaveBeenCalledWith(ctx, mockNext);
  });

  it('should call next when chat is undefined', async () => {
    const handler = jest.fn();
    const middleware = withChatType(['private'], handler);
    const ctx = createMockCtx({ chat: undefined });

    await middleware(ctx, mockNext);

    expect(handler).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });
});
