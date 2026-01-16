// Terms of Service panel with tabbed view

import { X, FileText, Scale } from 'lucide-react';
import { useState } from 'react';

interface TermsPanelProps {
  onClose: () => void;
}

export const TermsPanel: React.FC<TermsPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'readme' | 'license'>('readme');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-ide-panel border border-ide-border rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-ide-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ide-text">Terms & License</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-ide-toolbar rounded transition-colors"
          >
            <X className="w-5 h-5 text-ide-text" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-ide-border flex gap-1 px-6">
          <button
            onClick={() => setActiveTab('readme')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'readme'
                ? 'text-ide-text'
                : 'text-ide-textDim hover:text-ide-text'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Terms of Service</span>
            {activeTab === 'readme' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('license')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'license'
                ? 'text-ide-text'
                : 'text-ide-textDim hover:text-ide-text'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>License</span>
            {activeTab === 'license' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'readme' ? (
            <div className="prose prose-invert max-w-none">
              <h1 className="text-2xl font-bold text-ide-text mb-4">Terms of Service - SketchIDE</h1>
              <p className="text-sm text-ide-textDim mb-6">Last Updated: 2026</p>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-ide-text mb-3">1. Acceptance of Terms</h2>
                <p className="text-sm text-ide-text leading-relaxed">
                  By downloading, installing, accessing, or using SketchIDE ("the Software"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Software.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-ide-text mb-3">2. Copyright and Ownership</h2>
                <p className="text-sm text-ide-text leading-relaxed mb-2">
                  Copyright © 2026 Avi. All rights reserved.
                </p>
                <p className="text-sm text-ide-text leading-relaxed">
                  The Software and its associated documentation are protected by copyright laws and international copyright treaties.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-ide-text mb-3">3. License Grant</h2>
                <p className="text-sm text-ide-text leading-relaxed mb-2">
                  This Software is licensed under the GNU General Public License v3.0 (GPL-3.0). Subject to your compliance with these Terms and the GPL-3.0 license, you are granted the following rights:
                </p>
                <ul className="list-disc list-inside text-sm text-ide-text space-y-1 ml-4">
                  <li>Download, install, and use the Software for any purpose</li>
                  <li>Modify the source code as needed</li>
                  <li>Distribute the Software and your modifications</li>
                  <li>Access to the full source code</li>
                </ul>
                <p className="text-sm text-ide-text leading-relaxed mt-2">
                  <strong>Important:</strong> Any modifications or derivative works must also be licensed under GPL-3.0 (open source).
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-ide-text mb-3">4. Restrictions</h2>
                <p className="text-sm text-ide-text leading-relaxed mb-2">You may NOT:</p>
                <ul className="list-disc list-inside text-sm text-ide-text space-y-1 ml-4">
                  <li>Remove, alter, or obscure any copyright notices or license information</li>
                  <li>Use the Software for any illegal or unauthorized purpose</li>
                  <li>Distribute modified versions without also making the source code available under GPL-3.0</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-ide-text mb-3">5. Intellectual Property</h2>
                <p className="text-sm text-ide-text leading-relaxed mb-2">
                  All intellectual property rights in the Software, including but not limited to:
                </p>
                <ul className="list-disc list-inside text-sm text-ide-text space-y-1 ml-4">
                  <li>Source code</li>
                  <li>Graphics, logos, and visual elements</li>
                  <li>Documentation</li>
                  <li>Trademarks</li>
                </ul>
                <p className="text-sm text-ide-text leading-relaxed mt-2">
                  ...remain the property of Avi, licensed under GPL-3.0.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-ide-text mb-3">6. User-Generated Content</h2>
                <p className="text-sm text-ide-text leading-relaxed">
                  You retain ownership of any code, sketches, or content you create using the Software. However, by using the Software, you grant Avi a non-exclusive, royalty-free license to use, display, and distribute your content solely for the purpose of improving the Software, providing technical support, and demonstrating the Software's capabilities (with attribution).
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-ide-text mb-3">7. No Warranty</h2>
                <p className="text-sm text-ide-text leading-relaxed">
                  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-ide-text mb-3">8. Limitation of Liability</h2>
                <p className="text-sm text-ide-text leading-relaxed">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, AVI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-ide-text mb-3">9. Updates and Modifications</h2>
                <p className="text-sm text-ide-text leading-relaxed mb-2">
                  Avi reserves the right to:
                </p>
                <ul className="list-disc list-inside text-sm text-ide-text space-y-1 ml-4">
                  <li>Update, modify, or discontinue the Software at any time</li>
                  <li>Release updates that may add, modify, or remove features</li>
                  <li>Change these Terms at any time (continued use constitutes acceptance)</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-ide-text mb-3">10. Termination</h2>
                <p className="text-sm text-ide-text leading-relaxed">
                  These Terms are effective until terminated. Your rights under these Terms will terminate automatically if you fail to comply with any provision. Upon termination, you must cease all use of the Software and destroy all copies of the Software in your possession.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-ide-text mb-3">11. Contact Information</h2>
                <p className="text-sm text-ide-text leading-relaxed mb-2">
                  For questions about these Terms, please contact:
                </p>
                <ul className="list-none text-sm text-ide-text space-y-1 ml-4">
                  <li>Email: avi1srcs+SketchIDE@gmail.com</li>
                  <li>GitHub: <a href="https://github.com/Gmast2662/SketchIDE" target="_blank" rel="noopener noreferrer" className="text-ide-accent hover:underline">https://github.com/Gmast2662/SketchIDE</a></li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-ide-text mb-3">12. Acknowledgment</h2>
                <p className="text-sm text-ide-text leading-relaxed">
                  By using SketchIDE, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
              </section>

              <div className="mt-8 pt-4 border-t border-ide-border">
                <p className="text-xs text-ide-textDim">Copyright © 2026 Avi. All rights reserved.</p>
              </div>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none">
              <h1 className="text-2xl font-bold text-ide-text mb-4">GNU General Public License v3.0</h1>
              <p className="text-sm text-ide-textDim mb-6">
                Copyright (C) 2026 Avi
              </p>
              <p className="text-sm text-ide-text leading-relaxed mb-4">
                This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
              </p>
              <p className="text-sm text-ide-text leading-relaxed mb-4">
                This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
              </p>
              <p className="text-sm text-ide-text leading-relaxed mb-4">
                You should have received a copy of the GNU General Public License along with this program. If not, see <a href="https://www.gnu.org/licenses/" target="_blank" rel="noopener noreferrer" className="text-ide-accent hover:underline">https://www.gnu.org/licenses/</a>.
              </p>
              <div className="mt-6 p-4 bg-ide-toolbar rounded">
                <p className="text-sm text-ide-text leading-relaxed">
                  <strong>Key Points:</strong>
                </p>
                <ul className="list-disc list-inside text-sm text-ide-text space-y-1 mt-2 ml-4">
                  <li>You are free to use, modify, and distribute this software</li>
                  <li>You must make the source code available when distributing</li>
                  <li>Any modifications must also be licensed under GPL-3.0</li>
                  <li>This ensures the software remains free and open source</li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-ide-border">
                <p className="text-xs text-ide-textDim">For the full license text, see the LICENSE file in the repository.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
