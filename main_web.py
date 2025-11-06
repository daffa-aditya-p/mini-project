"""
Web-compatible version of Modern Flappy Bird
This version is optimized for Pygbag/browser deployment
"""
import asyncio
import pygame
import numpy as np
import sys
import json
import random
from pygame import gfxdraw
import math

# Initialize Pygame
pygame.init()

# Constants
SCREEN_WIDTH = 1024
SCREEN_HEIGHT = 768
FPS = 60

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
PRIMARY = (88, 101, 242)
SECONDARY = (71, 82, 196)
ACCENT = (235, 69, 158)
ACCENT_SECONDARY = (87, 242, 135)
BACKGROUND = (35, 39, 42)
GOLD = (255, 215, 0)

# Difficulty Settings
DIFFICULTY_SETTINGS = {
    "easy": {"gravity": 0.35, "jump_strength": -7, "initial_speed": 2.5, "speed_increment": 0.3, "pipe_gap": 220, "score_multiplier": 1},
    "normal": {"gravity": 0.5, "jump_strength": -8, "initial_speed": 3.5, "speed_increment": 0.5, "pipe_gap": 200, "score_multiplier": 2},
    "hardcore": {"gravity": 0.65, "jump_strength": -9, "initial_speed": 4.5, "speed_increment": 0.7, "pipe_gap": 180, "score_multiplier": 3}
}

class Utils:
    @staticmethod
    def create_gradient_surface(width, height, start_color, end_color, vertical=True):
        surface = pygame.Surface((width, height))
        for i in range(height if vertical else width):
            factor = i / (height if vertical else width)
            color = tuple(np.array(start_color) * (1 - factor) + np.array(end_color) * factor)
            if vertical:
                pygame.draw.line(surface, color, (0, i), (width, i))
            else:
                pygame.draw.line(surface, color, (i, 0), (i, height))
        return surface

    @staticmethod
    def draw_rounded_rect(surface, color, rect, radius):
        x, y, width, height = map(int, rect)
        radius = int(radius)
        diameter = radius * 2
        pygame.draw.rect(surface, color, (x + radius, y, width - diameter, height))
        pygame.draw.rect(surface, color, (x, y + radius, width, height - diameter))
        for circle_x, circle_y in [(x + radius, y + radius), (x + width - radius - 1, y + radius), 
                                   (x + radius, y + height - radius - 1), (x + width - radius - 1, y + height - radius - 1)]:
            circle_x, circle_y = int(circle_x), int(circle_y)
            pygame.gfxdraw.aacircle(surface, circle_x, circle_y, radius, color)
            pygame.gfxdraw.filled_circle(surface, circle_x, circle_y, radius, color)

class ParticleSystem:
    def __init__(self):
        self.particles = []

    def add_particle(self, x, y, color, velocity=(0, 0), lifetime=30):
        self.particles.append({'pos': [x, y], 'velocity': velocity, 'color': color, 'lifetime': lifetime, 'max_lifetime': lifetime})

    def update(self):
        for particle in self.particles[:]:
            particle['pos'][0] += particle['velocity'][0]
            particle['pos'][1] += particle['velocity'][1]
            particle['lifetime'] -= 1
            if particle['lifetime'] <= 0:
                self.particles.remove(particle)

    def draw(self, surface):
        for particle in self.particles:
            alpha = int(255 * (particle['lifetime'] / particle['max_lifetime']))
            pos = tuple(map(int, particle['pos']))
            pygame.draw.circle(surface, particle['color'], pos, 2)

class Button:
    def __init__(self, x, y, width, height, text, color=PRIMARY, hover_color=SECONDARY):
        self.rect = pygame.Rect(x, y, width, height)
        self.text = text
        self.color = color
        self.hover_color = hover_color
        self.current_color = color
        self.font = pygame.font.Font(None, 36)
        self.hover = False
        self.animation_progress = 0

    def update(self, mouse_pos):
        self.hover = self.rect.collidepoint(mouse_pos)
        target = 1 if self.hover else 0
        self.animation_progress += (target - self.animation_progress) * 0.2
        self.current_color = tuple(np.array(self.color) * (1 - self.animation_progress) + 
                                 np.array(self.hover_color) * self.animation_progress)

    def draw(self, surface):
        Utils.draw_rounded_rect(surface, self.current_color, self.rect, 10)
        text_surface = self.font.render(self.text, True, WHITE)
        text_rect = text_surface.get_rect(center=self.rect.center)
        surface.blit(text_surface, text_rect)

class Game:
    def __init__(self):
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption("Modern Flappy Bird - Web Edition")
        self.clock = pygame.time.Clock()
        self.state = "menu"
        self.particles = ParticleSystem()
        self.background_offset = 0
        self.font = pygame.font.Font(None, 36)
        self.difficulty = "normal"
        self.high_score = 0
        self.create_ui_elements()
        self.create_sounds()

    def create_ui_elements(self):
        center_x = SCREEN_WIDTH // 2 - 100
        self.menu_buttons = [
            Button(center_x, 250, 200, 50, "Play"),
            Button(center_x, 320, 200, 50, "Credits")
        ]

    def create_sounds(self):
        # Simplified sound generation for web
        sample_rate = 22050
        t = np.linspace(0, 0.1, int(sample_rate * 0.1))
        jump_wave = np.sin(2 * np.pi * 1000 * t) * np.exp(-t * 10)
        self.jump_sound = pygame.mixer.Sound(np.int16(jump_wave * 16383).tobytes())

    def draw_background(self):
        current_time = pygame.time.get_ticks() / 1000
        gradient_offset = (math.sin(current_time * 0.5) + 1) / 2
        base_gradient = Utils.create_gradient_surface(
            SCREEN_WIDTH, SCREEN_HEIGHT,
            tuple(map(lambda x, y: x * (1-gradient_offset) + y * gradient_offset, PRIMARY, SECONDARY)),
            tuple(map(lambda x, y: x * gradient_offset + y * (1-gradient_offset), SECONDARY, ACCENT))
        )
        self.screen.blit(base_gradient, (0, 0))

    def draw_bird(self, x, y, angle=0):
        bird_color = (255, 200, 31)
        bird_surface = pygame.Surface((40, 40), pygame.SRCALPHA)
        pygame.draw.ellipse(bird_surface, bird_color, (5, 5, 30, 20))
        wing_y = 15 + math.sin(pygame.time.get_ticks() / 100) * 3
        pygame.draw.ellipse(bird_surface, tuple(map(lambda x: int(x * 0.9), bird_color)), (10, wing_y, 15, 10))
        pygame.draw.circle(bird_surface, WHITE, (28, 12), 4)
        pygame.draw.circle(bird_surface, BLACK, (29, 12), 2)
        rotated_bird = pygame.transform.rotate(bird_surface, angle)
        bird_rect = rotated_bird.get_rect(center=(x, y))
        self.screen.blit(rotated_bird, bird_rect)

    async def main_menu(self):
        while self.state == "menu":
            mouse_pos = pygame.mouse.get_pos()
            
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    return False
                if event.type == pygame.MOUSEBUTTONDOWN:
                    if self.menu_buttons[0].rect.collidepoint(mouse_pos):
                        self.state = "playing"
                    elif self.menu_buttons[1].rect.collidepoint(mouse_pos):
                        self.state = "credits"

            self.draw_background()
            
            title_font = pygame.font.Font(None, 64)
            title = title_font.render("Modern Flappy Bird", True, WHITE)
            title_rect = title.get_rect(center=(SCREEN_WIDTH//2, 120))
            self.screen.blit(title, title_rect)
            
            subtitle = self.font.render("Web Edition", True, ACCENT)
            subtitle_rect = subtitle.get_rect(center=(SCREEN_WIDTH//2, 170))
            self.screen.blit(subtitle, subtitle_rect)
            
            for button in self.menu_buttons:
                button.update(mouse_pos)
                button.draw(self.screen)
            
            pygame.display.flip()
            self.clock.tick(FPS)
            await asyncio.sleep(0)
        return True

    async def credits_screen(self):
        credits = [
            {"name": "Daffa Aditya Pratama", "role": "Developer"},
            {"name": "Samsul Bahrur", "role": "Designer"}
        ]
        
        title_font = pygame.font.Font(None, 48)
        credit_font = pygame.font.Font(None, 36)
        role_font = pygame.font.Font(None, 24)
        
        while self.state == "credits":
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    return False
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_ESCAPE:
                        self.state = "menu"

            self.draw_background()
            
            title = title_font.render("Credits", True, WHITE)
            title_rect = title.get_rect(center=(SCREEN_WIDTH//2, 100))
            self.screen.blit(title, title_rect)
            
            time = pygame.time.get_ticks() / 1000
            for i, credit in enumerate(credits):
                y_offset = math.sin(time + i) * 10
                y_pos = 250 + i * 100 + y_offset
                
                name_text = credit_font.render(credit["name"], True, WHITE)
                name_rect = name_text.get_rect(center=(SCREEN_WIDTH//2, y_pos))
                self.screen.blit(name_text, name_rect)
                
                role_text = role_font.render(credit["role"], True, SECONDARY)
                role_rect = role_text.get_rect(center=(SCREEN_WIDTH//2, y_pos + 30))
                self.screen.blit(role_text, role_rect)
            
            hint = self.font.render("Press ESC to return", True, WHITE)
            self.screen.blit(hint, hint.get_rect(center=(SCREEN_WIDTH//2, SCREEN_HEIGHT - 50)))
            
            pygame.display.flip()
            self.clock.tick(FPS)
            await asyncio.sleep(0)
        return True

    async def play_game(self):
        diff_settings = DIFFICULTY_SETTINGS[self.difficulty]
        game_over = False
        bird_y = SCREEN_HEIGHT // 2
        bird_velocity = 0
        gravity = diff_settings["gravity"]
        jump_strength = diff_settings["jump_strength"]
        pipe_gap = diff_settings["pipe_gap"]
        pipe_width = 70
        pipe_speed = diff_settings["initial_speed"]
        pipes = [{'x': SCREEN_WIDTH, 'height': np.random.randint(100, SCREEN_HEIGHT - pipe_gap - 100), 'passed': False}]
        score = 0
        angle = 0

        while self.state == "playing":
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    return False
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_ESCAPE:
                        self.state = "menu"
                        return True
                    if event.key == pygame.K_SPACE and not game_over:
                        bird_velocity = jump_strength
                        self.jump_sound.play()

            if not game_over:
                bird_velocity += gravity
                bird_y += bird_velocity
                angle = np.clip(bird_velocity * 3, -45, 45)
                
                for pipe in pipes:
                    pipe['x'] -= pipe_speed

                pipes = [pipe for pipe in pipes if pipe['x'] > -pipe_width]

                if pipes[-1]['x'] < SCREEN_WIDTH - 300:
                    pipes.append({'x': SCREEN_WIDTH, 'height': np.random.randint(100, SCREEN_HEIGHT - pipe_gap - 100), 'passed': False})

                bird_rect = pygame.Rect(85, bird_y, 30, 30)
                for pipe in pipes:
                    upper_pipe = pygame.Rect(pipe['x'], 0, pipe_width, pipe['height'])
                    lower_pipe = pygame.Rect(pipe['x'], pipe['height'] + pipe_gap, pipe_width, SCREEN_HEIGHT)
                    if bird_rect.colliderect(upper_pipe) or bird_rect.colliderect(lower_pipe):
                        game_over = True
                    
                    if not pipe['passed'] and pipe['x'] < 85:
                        pipe['passed'] = True
                        score += 1
                        if score % 10 == 0:
                            pipe_speed += diff_settings["speed_increment"]

                if bird_y < 0 or bird_y > SCREEN_HEIGHT:
                    game_over = True

            self.draw_background()
            
            for pipe in pipes:
                Utils.draw_rounded_rect(self.screen, PRIMARY, (pipe['x'], 0, pipe_width, pipe['height']), 5)
                Utils.draw_rounded_rect(self.screen, PRIMARY, (pipe['x'], pipe['height'] + pipe_gap, pipe_width, SCREEN_HEIGHT), 5)

            self.draw_bird(100, bird_y, angle)

            score_text = self.font.render(f'Score: {score}', True, WHITE)
            self.screen.blit(score_text, score_text.get_rect(midtop=(SCREEN_WIDTH//2, 20)))

            if game_over:
                overlay = pygame.Surface((SCREEN_WIDTH, SCREEN_HEIGHT), pygame.SRCALPHA)
                overlay.fill((0, 0, 0, 192))
                self.screen.blit(overlay, (0, 0))
                
                large_font = pygame.font.Font(None, 72)
                game_over_text = large_font.render('Game Over!', True, WHITE)
                self.screen.blit(game_over_text, game_over_text.get_rect(center=(SCREEN_WIDTH//2, SCREEN_HEIGHT//2 - 50)))
                
                final_score_text = self.font.render(f'Final Score: {score}', True, GOLD)
                self.screen.blit(final_score_text, final_score_text.get_rect(center=(SCREEN_WIDTH//2, SCREEN_HEIGHT//2 + 20)))
                
                restart_text = self.font.render('Press ESC for menu', True, WHITE)
                self.screen.blit(restart_text, restart_text.get_rect(center=(SCREEN_WIDTH//2, SCREEN_HEIGHT - 100)))

            pygame.display.flip()
            self.clock.tick(FPS)
            await asyncio.sleep(0)
        return True

    async def run(self):
        running = True
        while running:
            if self.state == "menu":
                running = await self.main_menu()
            elif self.state == "playing":
                running = await self.play_game()
            elif self.state == "credits":
                running = await self.credits_screen()
        pygame.quit()

async def main():
    game = Game()
    await game.run()

# Entry point for Pygbag
asyncio.run(main())
